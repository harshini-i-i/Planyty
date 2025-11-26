import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import MeetingCard from '../components/meetings/MeetingCard';
import ScheduleMeetingForm from '../components/meetings/ScheduleMeetingForm';

// Mock data
const meetings = [
  {
    id: 1,
    title: 'Sprint Planning',
    date: 'Tomorrow, 10:00 AM',
    duration: '1 hour',
    attendees: 5,
    link: '#',
    status: 'Upcoming',
    project: 'Website Redesign',
    host: 'John Doe',
  },
  {
    id: 2,
    title: 'Design Review',
    date: 'Today, 2:00 PM',
    duration: '30 minutes',
    attendees: 3,
    link: '#',
    status: 'Upcoming',
    project: 'Mobile App',
    host: 'Jane Smith',
  },
  {
    id: 3,
    title: 'Project Kickoff',
    date: 'Yesterday, 9:00 AM',
    duration: '1.5 hours',
    attendees: 7,
    link: '#',
    status: 'Completed',
    project: 'API Development',
    host: 'Mike Johnson',
  },
];

const Meetings = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const handleScheduleMeeting = (meetingData) => {
    console.log('Scheduling meeting:', meetingData);
    // Here you would typically send the data to your backend
    // For now, we'll just log it
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      {/* REDUCED HEADER */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Meetings Schedule</h1>
          <Button 
            onClick={() => setShowScheduleForm(true)}
            className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Schedule New
          </Button>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>

      {/* Schedule Meeting Form Modal - Now using the styled version */}
      <ScheduleMeetingForm
        isOpen={showScheduleForm}
        onClose={() => setShowScheduleForm(false)}
        onSubmit={handleScheduleMeeting}
      />
    </div>
  );
};

export default Meetings;