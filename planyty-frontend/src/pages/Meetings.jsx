import React from 'react';
import { Calendar, Clock, Users, Video, Plus } from 'lucide-react';
import Button from '../components/ui/Button';

const meetings = [
  {
    id: 1,
    title: 'Sprint Planning',
    date: 'Tomorrow, 10:00 AM',
    duration: '1 hour',
    attendees: 5,
    link: '#',
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Design Review',
    date: 'Today, 2:00 PM',
    duration: '30 minutes',
    attendees: 3,
    link: '#',
    status: 'Upcoming',
  },
  {
    id: 3,
    title: 'Project Kickoff',
    date: 'Yesterday, 9:00 AM',
    duration: '1.5 hours',
    attendees: 7,
    link: '#',
    status: 'Completed',
  },
];

const MeetingCard = ({ meeting }) => {
  const statusColor = meeting.status === 'Upcoming' 
    ? 'bg-purple-100 text-purple-800' 
    : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{meeting.title}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {meeting.status}
        </span>
      </div>
      
      <div className="space-y-2 text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
          <span>{meeting.date}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          <span>{meeting.duration}</span>
        </div>
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-500" />
          <span>{meeting.attendees} Attendees</span>
        </div>
      </div>

      <div className="flex justify-end">
        {meeting.status === 'Upcoming' ? (
          <Button 
            className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Video className="w-5 h-5 mr-2" />
            Join Meeting
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
            View Summary
          </Button>
        )}
      </div>
    </div>
  );
};

const Meetings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meetings Schedule</h1>
        <Button 
          className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
};

export default Meetings;