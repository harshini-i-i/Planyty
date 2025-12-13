const { sequelize } = require('../config/database');
const User = require('./user.model');
const Project = require('./project.model');
const Task = require('./task.model');
const Invitation = require('./invitation.model');

// Define associations
User.hasMany(Project, { foreignKey: 'created_by', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

User.hasMany(Invitation, { foreignKey: 'invited_by', as: 'sentInvitations' });
Invitation.belongsTo(User, { foreignKey: 'invited_by', as: 'inviter' });

const db = {
  sequelize,
  User,
  Project,
  Task,
  Invitation
};

module.exports = db;