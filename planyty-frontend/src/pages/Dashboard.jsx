import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Filter, PieChart, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, filter, onSeeAll }) => (
  <div className="p-6 bg-white rounded-xl border border-gray-200">
    <div className="flex items-start justify-between mb-2">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1 truncate">{value}</p>
      </div>
      {filter && (
        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
          <Filter className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-400 truncate">
        {filter ? '= 1 Filter' : 'No Filters'}
      </span>
      {filter && onSeeAll && (
        <button 
          onClick={onSeeAll}
          className="text-xs text-blue-600 cursor-pointer flex-shrink-0 ml-2 hover:text-blue-700 flex items-center"
        >
          See all <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  </div>
);

const PieChartComponent = ({ data, title, filterCount = 1, onSeeAll }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#EF4444', '#F59E0B', '#10B981']; // Red, Yellow, Green for High, Medium, Low
  
  let accumulatedAngle = 0;
  
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">= {filterCount} Filter</span>
          <button 
            onClick={onSeeAll}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            See all <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Bigger Pie Chart */}
        <div className="relative w-48 h-48 mb-6 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const angle = (percentage / 100) * 360;
              const largeArc = angle > 180 ? 1 : 0;
              
              const x1 = 50 + 50 * Math.cos(accumulatedAngle * Math.PI / 180);
              const y1 = 50 + 50 * Math.sin(accumulatedAngle * Math.PI / 180);
              accumulatedAngle += angle;
              const x2 = 50 + 50 * Math.cos(accumulatedAngle * Math.PI / 180);
              const y2 = 50 + 50 * Math.sin(accumulatedAngle * Math.PI / 180);
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 50 50 0 ${largeArc} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Labels - Full width below pie chart */}
        <div className="w-full space-y-3">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={index} className="flex items-center justify-between w-full">
                <div className="flex items-center min-w-0 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">{item.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 ml-4 flex-shrink-0">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BarChartComponent = ({ data, title, filterCount = 1, onSeeAll }) => (
  <div className="p-6 bg-white rounded-xl border border-gray-200">
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">= {filterCount} Filter</span>
        <button 
          onClick={onSeeAll}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          See all <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
    
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-600 w-20 truncate flex-shrink-0">{item.label}</span>
          <div className="flex-1 mx-3 min-w-0">
            <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(item.value, 100)}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-900 w-12 text-right flex-shrink-0">
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

const TimelineBarChart = ({ projects, title, filterCount = 1, onSeeAll }) => {
  // Generate timeline data with dates and task counts
  const timelineData = [
    { date: 'Jan 1', tasks: 12, projects: ['E-commerce Platform'] },
    { date: 'Jan 8', tasks: 8, projects: ['Mobile App'] },
    { date: 'Jan 15', tasks: 15, projects: ['Marketing Campaign'] },
    { date: 'Jan 22', tasks: 6, projects: ['Website Redesign'] },
    { date: 'Jan 29', tasks: 20, projects: ['API Development', 'Product Research'] },
    { date: 'Feb 5', tasks: 10, projects: ['Customer Portal'] },
    { date: 'Feb 12', tasks: 5, projects: ['Documentation'] },
  ];

  const maxTasks = Math.max(...timelineData.map(item => item.tasks));

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">= {filterCount} Filter</span>
          <button 
            onClick={onSeeAll}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            See all <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Y-axis labels and chart area */}
      <div className="flex">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-64 mr-4 text-xs text-gray-500">
          <span>{maxTasks}</span>
          <span>{Math.round(maxTasks * 0.75)}</span>
          <span>{Math.round(maxTasks * 0.5)}</span>
          <span>{Math.round(maxTasks * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart content */}
        <div className="flex-1">
          {/* Bars */}
          <div className="flex items-end justify-between h-64 border-b border-l border-gray-300 pb-4 pl-4">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 mx-1">
                {/* Bar */}
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-200 cursor-pointer relative group"
                  style={{ 
                    height: `${(item.tasks / maxTasks) * 100}%`,
                    minHeight: '4px'
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      <div className="font-semibold">{item.tasks} tasks</div>
                      <div className="text-gray-300">
                        {item.projects.join(', ')}
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
                {/* X-axis date label */}
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {item.date}
                </div>
                
                {/* Task count below bar */}
                <div className="text-xs font-semibold text-gray-700 mt-1">
                  {item.tasks}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">Timeline (Weeks)</span>
          </div>
        </div>
      </div>

      {/* Project labels */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {projects.slice(0, 4).map((project, index) => (
          <div key={project.id} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 rounded mr-2 flex-shrink-0"
              style={{ 
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]
              }}
            />
            <span className="text-gray-600 truncate">{project.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add widget
        </button>
        <div className="text-xs text-gray-500">
          Total Tasks: <span className="font-semibold">
            {timelineData.reduce((sum, item) => sum + item.tasks, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock project data with adjusted priorities for better pie chart distribution
  const projects = [
    { id: 1, name: 'E-commerce Platform', progress: 75, status: 'in-progress', priority: 'high' },
    { id: 2, name: 'Mobile App', progress: 30, status: 'in-progress', priority: 'high' },
    { id: 3, name: 'Marketing Campaign', progress: 90, status: 'completed', priority: 'medium' },
    { id: 4, name: 'Website Redesign', progress: 45, status: 'in-progress', priority: 'medium' },
    { id: 5, name: 'API Development', progress: 100, status: 'completed', priority: 'low' },
    { id: 6, name: 'Product Research', progress: 20, status: 'planning', priority: 'low' },
    { id: 7, name: 'Customer Portal', progress: 60, status: 'in-progress', priority: 'high' },
    { id: 8, name: 'Documentation', progress: 85, status: 'review', priority: 'low' },
  ];

  // Calculate project statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
  const overdueProjects = projects.filter(p => p.progress < 100 && p.status !== 'completed').length;

  // Projects by status for pie chart
  const projectsByStatus = [
    { label: 'Planning', value: projects.filter(p => p.status === 'planning').length },
    { label: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length },
    { label: 'Review', value: projects.filter(p => p.status === 'review').length },
    { label: 'Completed', value: completedProjects },
  ];

  // Projects by completion for bar chart
  const projectsByCompletion = projects.slice(0, 5).map(project => ({
    label: project.name,
    value: project.progress
  }));

  // Projects by priority - adjusted for better pie chart visualization
  const projectsByPriority = [
    { label: 'High', value: projects.filter(p => p.priority === 'high').length },
    { label: 'Medium', value: projects.filter(p => p.priority === 'medium').length },
    { label: 'Low', value: projects.filter(p => p.priority === 'low').length },
  ];

  // Single navigation handler for all "See all" buttons
  const handleSeeAll = () => navigate('/workspaces');

  const stats = [
    { 
      title: 'Total complete', 
      value: completedProjects.toString(), 
      filter: true,
      onSeeAll: handleSeeAll
    },
    { 
      title: 'Total in progress', 
      value: inProgressProjects.toString(), 
      filter: true,
      onSeeAll: handleSeeAll
    },
    { 
      title: 'Total overdue projects', 
      value: overdueProjects.toString(), 
      filter: true,
      onSeeAll: handleSeeAll
    },
    { 
      title: 'Total projects', 
      value: totalProjects.toString(), 
      filter: false 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name || 'User'}! Overview of all your projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by status - Pie Chart */}
        <PieChartComponent 
          title="Projects by status" 
          data={projectsByStatus}
          filterCount={1}
          onSeeAll={handleSeeAll}
        />

        {/* Projects by completion - Bar Chart */}
        <BarChartComponent 
          title="Projects by completion" 
          data={projectsByCompletion}
          filterCount={1}
          onSeeAll={handleSeeAll}
        />

        {/* Projects by priority - BIG Pie Chart */}
        <PieChartComponent 
          title="Projects by priority" 
          data={projectsByPriority}
          filterCount={2}
          onSeeAll={handleSeeAll}
        />

        {/* Project Timeline - Bar Chart with X,Y axis */}
        <TimelineBarChart 
          title="Project Timeline"
          projects={projects}
          filterCount={1}
          onSeeAll={handleSeeAll}
        />
      </div>
    </div>
  );
};

export default Dashboard;