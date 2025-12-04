import React, { useState } from 'react';
import Button from '../ui/Button';
import { X, Palette, ChevronDown, Sparkles } from 'lucide-react';

const WorkspaceForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || 'purple'
  });

  const colors = [
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-purple-200 animate-float scrollbar-hide">
        <div className="flex justify-between items-center p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
          <h2 className="text-xl font-semibold text-purple-800 animate-pulse-slow">
            {initialData ? 'Edit Workspace' : 'Create New Workspace'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 animate-bounce-slow"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="animate-slide-up delay-100">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Workspace Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 transition-all duration-300 hover:scale-105 focus:scale-105"
              placeholder="Enter workspace name"
            />
          </div>

          <div className="animate-slide-up delay-200">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 transition-all duration-300 hover:scale-105 focus:scale-105"
              placeholder="Enter workspace description"
            />
          </div>

          <div className="animate-slide-up delay-300">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1 text-purple-600 animate-bounce" />
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-full h-12 rounded-xl ${color.class} border-4 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                    formData.color === color.value 
                      ? 'border-purple-800 shadow-xl scale-105' 
                      : 'border-transparent hover:border-white'
                  } animate-bounce-in`}
                  title={color.label}
                >
                  <span className="text-white text-xs font-bold drop-shadow-lg">
                    {formData.color === color.value && '✓'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 animate-slide-up delay-400">
            <Button
              type="button"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md animate-pulse-slow"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-2 border-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg animate-pulse-slow"
            >
              {initialData ? 'Save Changes 🚀' : 'Create Workspace 🚀'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceForm;