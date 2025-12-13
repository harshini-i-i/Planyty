const { Project, User, Task } = require('../models');
const { sendProjectEvent, sendActivityLog } = require('../services/kafka.producer');
const { paginate } = require('../utils/helpers');

exports.createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body;

    const project = await Project.create({
      name,
      description,
      start_date,
      end_date,
      created_by: req.user.id,
      status: 'planned'
    });

    // Send Kafka events
    await sendProjectEvent('PROJECT_CREATED', project, req.user.id);
    await sendActivityLog(
      req.user.id,
      'CREATE_PROJECT',
      'project',
      project.id,
      { projectName: project.name }
    );

    res.status(201).json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const { offset, limit: queryLimit } = paginate(page, limit);

    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.name = { $like: `%${search}%` };
    }

    // If not admin, only show projects created by this user or where user is team member
    if (req.user.role !== 'admin') {
      where.created_by = req.user.id;
      // Note: You might want to expand this to include projects where user is a team member
    }

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      offset,
      limit: queryLimit,
      order: [['created_at', 'DESC']]
    });

    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: queryLimit,
        total: count,
        pages: Math.ceil(count / queryLimit)
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Task,
          as: 'tasks',
          include: [{
            model: User,
            as: 'assignee',
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && project.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this project' });
    }

    res.json({ project });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, start_date, end_date } = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && project.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    const oldData = { ...project.toJSON() };
    
    await project.update({
      name: name || project.name,
      description: description !== undefined ? description : project.description,
      status: status || project.status,
      start_date: start_date || project.start_date,
      end_date: end_date || project.end_date
    });

    // Send Kafka events
    await sendProjectEvent('PROJECT_UPDATED', project, req.user.id, { oldData });
    await sendActivityLog(
      req.user.id,
      'UPDATE_PROJECT',
      'project',
      project.id,
      { 
        projectName: project.name,
        changes: Object.keys(req.body).filter(key => req.body[key] !== undefined)
      }
    );

    res.json({
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && project.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    // Check if project has tasks
    const taskCount = await Task.count({ where: { project_id: id } });
    if (taskCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete project with existing tasks. Delete tasks first.' 
      });
    }

    await project.destroy();

    // Send Kafka events
    await sendProjectEvent('PROJECT_DELETED', project, req.user.id);
    await sendActivityLog(
      req.user.id,
      'DELETE_PROJECT',
      'project',
      id,
      { projectName: project.name }
    );

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && project.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this project' });
    }

    const tasks = await Task.findAll({ where: { project_id: id } });
    
    const stats = {
      total_tasks: tasks.length,
      todo_tasks: tasks.filter(t => t.status === 'todo').length,
      in_progress_tasks: tasks.filter(t => t.status === 'in_progress').length,
      completed_tasks: tasks.filter(t => t.status === 'completed').length,
      total_estimated_hours: tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0),
      total_actual_hours: tasks.reduce((sum, task) => sum + (task.actual_hours || 0), 0),
      priority_distribution: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
        critical: tasks.filter(t => t.priority === 'critical').length
      }
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ error: 'Failed to get project statistics' });
  }
};