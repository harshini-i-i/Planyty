import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  Users, 
  Flag, 
  CheckCircle, 
  ChevronLeft,
  Edit, 
  Trash2, 
  Share2, 
  MoreVertical,
  BarChart3,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Plus,
  MessageSquare,
  Activity
} from 'lucide-react';
import Button from '../ui/Button';

const GoalDetails = ({ goal, onClose, onEdit, onDelete }) => {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(goal.progress || 0);
  const [newComment, setNewComment] = useState('');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysRemaining = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-400';
      case 'low': return 'bg-gradient-to-r from-green-400 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Company Goals': return 'from-purple-500 to-pink-500';
      case 'Team Goals': return 'from-blue-500 to-cyan-400';
      case 'Personal Goals': return 'from-green-400 to-emerald-500';
      case 'Quarterly Goals': return 'from-orange-500 to-yellow-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const daysRemaining = getDaysRemaining(goal.dueDate);
  const isOverdue = daysRemaining < 0;

  // Mock data for activity
  const activities = [
    { id: 1, user: 'Alex Johnson', action: 'created this goal', time: '2 days ago' },
    { id: 2, user: 'Sarah Miller', action: 'updated progress to 45%', time: '1 day ago' },
    { id: 3, user: 'Mike Chen', action: 'added a key result', time: '12 hours ago' },
    { id: 4, user: 'You', action: 'completed "Launch new onboarding flow"', time: '2 hours ago' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 border-2 border-purple-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-200 mr-2"
              >
                <ChevronLeft className="w-5 h-5 text-purple-500" />
              </button>
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(goal.priority)}`}></div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r ${getCategoryColor(goal.category)} text-white`}>
                {goal.category}
              </span>
              {!goal.isPublic && (
                <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-800">
                  <EyeOff className="w-3 h-3" />
                  Private
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{goal.title}</h1>
            <p className="text-gray-600">{goal.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onEdit(goal)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Progress
                </h2>
                {isEditingProgress ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentProgress}
                      onChange={(e) => setCurrentProgress(parseInt(e.target.value))}
                      className="w-32 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                    />
                    <span className="w-12 text-center font-semibold text-purple-700">
                      {currentProgress}%
                    </span>
                    <Button
                      onClick={() => setIsEditingProgress(false)}
                      className="text-sm bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentProgress(goal.progress);
                        setIsEditingProgress(false);
                      }}
                      className="text-sm bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditingProgress(true)}
                    className="text-sm bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Update Progress
                  </Button>
                )}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${getCategoryColor(goal.category)} transition-all duration-300`}
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current: {currentProgress}%</span>
                <span className="font-semibold text-purple-600">Target: {goal.targetProgress || 100}%</span>
              </div>
            </div>

            {/* Key Results */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-500" />
                Key Results
              </h2>
              
              <div className="space-y-4">
                {goal.keyResults.map((kr, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {kr.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0"></div>
                        )}
                        <div>
                          <p className={`font-medium ${kr.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {kr.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Key result description would go here</p>
                        </div>
                      </div>
                      
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Key Result
                </Button>
              </div>
            </div>

            {/* Activity */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-500" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-800">{activity.user}</span>
                        <span className="text-gray-600"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 border-l border-gray-200 p-6 bg-gray-50">
            {/* Assigned To */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assigned To
              </h3>
              <div className="space-y-2">
                {goal.assignedTo.map((person, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {person.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{person}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-3 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Plus className="w-3 h-3 mr-2" />
                Add People
              </Button>
            </div>

            {/* Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-800">{formatDate(goal.dueDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                      {isOverdue ? 'Overdue' : `${daysRemaining} days left`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(goal.priority)}`}></div>
                      <p className="font-medium text-gray-800 capitalize">{goal.priority}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-800">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Goal
                </Button>
                <Button className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
                <Button 
                  onClick={() => onDelete(goal.id)}
                  className="w-full justify-start bg-red-50 border border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Goal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;