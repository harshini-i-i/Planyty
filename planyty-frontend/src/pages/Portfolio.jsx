import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  Clock, 
  CheckCircle, 
  Folder,
  BarChart3,
  Star,
  ExternalLink,
  Calendar
} from 'lucide-react';

// Mock data for portfolio
const portfolioData = {
  userInfo: {
    name: "Alex Johnson",
    role: "Senior Project Manager",
avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=1e88e5",
    joinedDate: "2022-03-15",
    totalProjects: 24,
    completedProjects: 18,
    ongoingProjects: 4,
    successRate: 92
  },
  stats: [
    { label: "Total Projects", value: "24", icon: Folder, color: "from-purple-500 to-pink-500", change: "+12%" },
    { label: "Success Rate", value: "92%", icon: Target, color: "from-green-400 to-emerald-500", change: "+3%" },
    { label: "Team Members", value: "15", icon: Users, color: "from-blue-500 to-cyan-400", change: "+4" },
    { label: "Avg. Completion", value: "28 days", icon: Clock, color: "from-orange-500 to-yellow-500", change: "-3 days" }
  ],
  skills: [
    { name: "Project Planning", level: 95 },
    { name: "Team Leadership", level: 92 },
    { name: "Risk Management", level: 88 },
    { name: "Agile Methodology", level: 96 },
    { name: "Budget Control", level: 90 },
    { name: "Client Communication", level: 94 }
  ],
  recentProjects: [
    { id: 1, name: "E-commerce Platform", status: "completed", progress: 100, teamSize: 8, duration: "45 days", rating: 4.8 },
    { id: 2, name: "Mobile Banking App", status: "completed", progress: 100, teamSize: 12, duration: "60 days", rating: 4.9 },
    { id: 3, name: "Healthcare System", status: "ongoing", progress: 75, teamSize: 15, duration: "90 days", rating: null },
    { id: 4, name: "AI Analytics Tool", status: "ongoing", progress: 40, teamSize: 10, duration: "120 days", rating: null }
  ],
  achievements: [
    { title: "Project Excellence 2023", description: "Best managed project of the year", date: "2023-12-01", icon: Award },
    { title: "On-Time Delivery", description: "15 consecutive projects delivered on schedule", date: "2023-10-15", icon: CheckCircle },
    { title: "Client Satisfaction", description: "98% positive client feedback", date: "2023-08-22", icon: Star },
    { title: "Team Leadership", description: "Managed largest team (18 members) successfully", date: "2023-06-10", icon: Users }
  ]
};

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('quarterly');

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate experience in years
  const calculateExperience = () => {
    const joinDate = new Date(portfolioData.userInfo.joinedDate);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 365);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Portfolio Dashboard</h1>
              <p className="text-gray-600">Track your project management performance and achievements</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <Link to="/projects">
              <Button className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors duration-200">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* User Profile Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={portfolioData.userInfo.avatar}
                      alt={portfolioData.userInfo.name}
                      className="w-20 h-20 rounded-full border-4 border-purple-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{portfolioData.userInfo.name}</h2>
                    <p className="text-gray-600 mb-1">{portfolioData.userInfo.role}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {formatDate(portfolioData.userInfo.joinedDate)}
                      </span>
                      <span>•</span>
                      <span>{calculateExperience()} years experience</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {portfolioData.userInfo.successRate}% Success Rate
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{portfolioData.userInfo.completedProjects}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{portfolioData.userInfo.ongoingProjects}</div>
                    <div className="text-sm text-gray-600">Ongoing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {portfolioData.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.change.includes('+') || stat.change.includes('%') 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Core Skills
              </h3>
              <span className="text-sm text-gray-500">Proficiency Level</span>
            </div>
            
            <div className="space-y-4">
              {portfolioData.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Folder className="w-5 h-5 text-purple-500" />
              Recent Projects
            </h3>
            
            <div className="space-y-3">
              {portfolioData.recentProjects.map((project) => (
                <div key={project.id} className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{project.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {project.rating && (
                      <span className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        {project.rating}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Team: {project.teamSize}</span>
                      <span>Duration: {project.duration}</span>
                    </div>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            project.status === 'completed' 
                              ? 'bg-gradient-to-r from-green-400 to-green-500'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-500" />
            Recent Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioData.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{formatDate(achievement.date)}</span>
                        <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;