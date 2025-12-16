import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import {
  Target,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Star,
  Flag,
  Award,
  BarChart3,
  Clock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Share2,
  MoreVertical
} from 'lucide-react';
import { GoalForm, GoalDetails } from '../components/goals';

// Mock goals data
const initialGoals = [
  {
    id: 1,
    title: 'Increase Monthly Active Users by 30%',
    category: 'Company Goals',
    description: 'Grow MAU from 50k to 65k through marketing campaigns and feature improvements',
    progress: 65,
    dueDate: '2024-12-31',
    priority: 'high',
    isPublic: true,
    assignedTo: ['Alex', 'Sarah', 'Mike'],
    targetProgress: 100,
    keyResults: [
      { title: 'Launch new onboarding flow', completed: true },
      { title: 'Improve referral program', completed: true },
      { title: 'Add social sharing features', completed: false },
      { title: 'Run 3 major marketing campaigns', completed: true }
    ]
  },
  {
    id: 2,
    title: 'Improve Customer Satisfaction Score',
    category: 'Team Goals',
    description: 'Achieve CSAT score of 4.5+ across all customer touchpoints',
    progress: 80,
    dueDate: '2024-11-15',
    priority: 'medium',
    isPublic: true,
    assignedTo: ['David', 'Lisa'],
    targetProgress: 100,
    keyResults: [
      { title: 'Implement new support ticket system', completed: true },
      { title: 'Train support team on new processes', completed: true },
      { title: 'Reduce response time to under 2 hours', completed: false }
    ]
  },
  {
    id: 3,
    title: 'Launch Mobile App V2',
    category: 'Quarterly Goals',
    description: 'Complete development and launch of mobile app with new features',
    progress: 45,
    dueDate: '2024-10-30',
    priority: 'high',
    isPublic: true,
    assignedTo: ['Team Mobile'],
    targetProgress: 100,
    keyResults: [
      { title: 'Complete UI redesign', completed: true },
      { title: 'Implement offline mode', completed: false },
      { title: 'Add push notifications', completed: false },
      { title: 'Beta testing with 500 users', completed: true }
    ]
  },
  {
    id: 4,
    title: 'Complete Professional Certification',
    category: 'Personal Goals',
    description: 'Obtain PMP certification to enhance project management skills',
    progress: 90,
    dueDate: '2024-09-30',
    priority: 'low',
    isPublic: false,
    assignedTo: ['You'],
    targetProgress: 100,
    keyResults: [
      { title: 'Complete study materials', completed: true },
      { title: 'Pass practice exams', completed: true },
      { title: 'Schedule exam date', completed: true },
      { title: 'Pass final certification', completed: false }
    ]
  },
  {
    id: 5,
    title: 'Reduce Infrastructure Costs',
    category: 'Company Goals',
    description: 'Cut cloud infrastructure costs by 20% through optimization',
    progress: 30,
    dueDate: '2024-12-31',
    priority: 'medium',
    isPublic: true,
    assignedTo: ['Engineering'],
    targetProgress: 100,
    keyResults: [
      { title: 'Audit current infrastructure', completed: true },
      { title: 'Implement auto-scaling', completed: false },
      { title: 'Migrate to reserved instances', completed: false },
      { title: 'Optimize database queries', completed: false }
    ]
  }
];

const categories = [
  { id: 1, name: 'Company Goals', color: 'from-purple-500 to-pink-500', count: 2 },
  { id: 2, name: 'Team Goals', color: 'from-blue-500 to-cyan-400', count: 1 },
  { id: 3, name: 'Personal Goals', color: 'from-green-400 to-emerald-500', count: 1 },
  { id: 4, name: 'Quarterly Goals', color: 'from-orange-500 to-yellow-500', count: 1 }
];

const Goals = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showGoalDetails, setShowGoalDetails] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);

  // Filter goals based on selected category and search
  const filteredGoals = goals.filter(goal => {
    const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory;
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompleted = showCompleted || goal.progress < 100;
    return matchesCategory && matchesSearch && matchesCompleted;
  });

  // Calculate progress overview
  const progressOverview = {
    totalGoals: goals.length,
    completed: goals.filter(g => g.progress === 100).length,
    inProgress: goals.filter(g => g.progress > 0 && g.progress < 100).length,
    notStarted: goals.filter(g => g.progress === 0).length,
    completionRate: Math.round((goals.filter(g => g.progress === 100).length / goals.length) * 100)
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-400';
      case 'low': return 'bg-gradient-to-r from-green-400 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  // Handle goal creation/update
  const handleGoalSubmit = (goalData) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id ? { ...goalData, id: goal.id } : goal
      ));
      setEditingGoal(null);
    } else {
      // Create new goal
      const newGoal = {
        ...goalData,
        id: goals.length + 1,
        progress: 0
      };
      setGoals([...goals, newGoal]);
    }
    setShowAddGoalModal(false);
  };

  // Handle goal deletion
  const handleGoalDelete = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    setShowGoalDetails(false);
    setSelectedGoal(null);
  };

  // Handle goal edit
  const handleGoalEdit = (goal) => {
    setEditingGoal(goal);
    setShowGoalDetails(false);
    setShowAddGoalModal(true);
  };

  // Handle view goal details
  const handleViewGoalDetails = (goal) => {
    setSelectedGoal(goal);
    setShowGoalDetails(true);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Goals & OKRs</h1>
            <p className="text-gray-600">Track objectives, key results, and measure progress</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setEditingGoal(null);
                setShowAddGoalModal(true);
              }}
              className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-800">{progressOverview.totalGoals}</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">{progressOverview.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{progressOverview.inProgress}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-800">{progressOverview.completionRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Goals
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Toggle Completed */}
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`p-2 rounded-lg border ${
                  showCompleted
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700'
                } hover:opacity-90 transition-colors duration-200`}
                title={showCompleted ? 'Hide completed' : 'Show completed'}
              >
                {showCompleted ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              <button className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGoals.map(goal => {
              const daysRemaining = getDaysRemaining(goal.dueDate);
              const isOverdue = daysRemaining < 0;
              
              return (
                <div key={goal.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Goal Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(goal.priority)}`}></div>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            {goal.category}
                          </span>
                          {!goal.isPublic && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Private
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        
                        {/* Assigned To */}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div className="flex -space-x-2">
                            {goal.assignedTo.slice(0, 3).map((person, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                                title={person}
                              >
                                {person.charAt(0)}
                              </div>
                            ))}
                            {goal.assignedTo.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">
                                +{goal.assignedTo.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingGoal(goal);
                            setShowAddGoalModal(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="font-bold text-purple-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Key Results */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">KEY RESULTS</p>
                      {goal.keyResults.slice(0, 3).map((kr, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {kr.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                          )}
                          <span className={`text-sm ${kr.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                            {kr.title}
                          </span>
                        </div>
                      ))}
                      {goal.keyResults.length > 3 && (
                        <div className="text-xs text-gray-500 pl-6">
                          +{goal.keyResults.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Goal Footer */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {isOverdue ? 'Overdue' : `${daysRemaining} days left`}
                        </span>
                      </div>
                      
                      {goal.priority === 'high' && (
                        <span className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                          <Flag className="w-3 h-3" />
                          High Priority
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleViewGoalDetails(goal)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Empty State */}
          {filteredGoals.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No goals found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or create a new goal</p>
              <Button 
                onClick={() => {
                  setEditingGoal(null);
                  setShowAddGoalModal(true);
                }}
                className="flex items-center mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Goal
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Goal Creation/Editing Modal */}
      {showAddGoalModal && (
        <GoalForm
          goal={editingGoal}
          onClose={() => {
            setShowAddGoalModal(false);
            setEditingGoal(null);
          }}
          onSubmit={handleGoalSubmit}
        />
      )}

      {/* Goal Details Modal */}
      {showGoalDetails && selectedGoal && (
        <GoalDetails
          goal={selectedGoal}
          onClose={() => {
            setShowGoalDetails(false);
            setSelectedGoal(null);
          }}
          onEdit={handleGoalEdit}
          onDelete={handleGoalDelete}
        />
      )}
    </div>
  );
};

export default Goals;