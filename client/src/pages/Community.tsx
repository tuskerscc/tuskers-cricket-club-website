import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Award,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CommunityEvent, EventParticipant, UserProfile } from '@shared/schema';

interface CommunityEventWithDetails extends CommunityEvent {
  participants: (EventParticipant & { user: UserProfile })[];
  isRegistered: boolean;
}

export default function Community() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEventWithDetails | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    organizer: '',
    maxParticipants: 50
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<CommunityEventWithDetails[]>({
    queryKey: ['/api/community/events'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/community/stats'],
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/events'] });
      setShowCreateEvent(false);
      setNewEvent({ title: '', description: '', eventDate: '', location: '', organizer: '', maxParticipants: 50 });
      toast({ title: "Success", description: "Event created successfully!" });
    },
  });

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/community/events/${eventId}/join`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to join event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/events'] });
      toast({ title: "Success", description: "Successfully registered for the event!" });
    },
  });

  const leaveEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/community/events/${eventId}/leave`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to leave event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/events'] });
      toast({ title: "Success", description: "Successfully left the event!" });
    },
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.eventDate || !newEvent.location) {
      toast({ title: "Error", description: "Please fill in all required fields" });
      return;
    }
    createEventMutation.mutate(newEvent);
  };

  const upcomingEvents = events.filter(event => new Date(event.eventDate) > new Date());
  const pastEvents = events.filter(event => new Date(event.eventDate) <= new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Community Events</h1>
              <p className="text-gray-600">Join fellow fans at cricket matches, meetups, and club activities</p>
            </div>
            
            <button
              onClick={() => setShowCreateEvent(true)}
              className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                  Upcoming Events ({upcomingEvents.length})
                </h2>
              </div>
              
              {isLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>{event.currentParticipants}/{event.maxParticipants || '∞'} participants</span>
                            </div>
                          </div>
                          
                          {event.organizer && (
                            <div className="mt-2 text-sm text-gray-500">
                              Organized by {event.organizer}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {event.isRegistered ? (
                            <button
                              onClick={() => leaveEventMutation.mutate(event.id)}
                              disabled={leaveEventMutation.isPending}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <UserMinus className="w-4 h-4" />
                              Leave Event
                            </button>
                          ) : (
                            <button
                              onClick={() => joinEventMutation.mutate(event.id)}
                              disabled={joinEventMutation.isPending || (event.maxParticipants && event.currentParticipants >= event.maxParticipants)}
                              className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                            >
                              <UserPlus className="w-4 h-4" />
                              {event.maxParticipants && event.currentParticipants >= event.maxParticipants ? 'Event Full' : 'Join Event'}
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {event.maxParticipants && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Registration Progress</span>
                            <span>{Math.round((event.currentParticipants / event.maxParticipants) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#1e3a8a] h-2 rounded-full transition-all"
                              style={{ width: `${Math.min((event.currentParticipants / event.maxParticipants) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {upcomingEvents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No upcoming events scheduled. Check back soon!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#1e3a8a]" />
                    Past Events
                  </h2>
                </div>
                
                <div className="divide-y">
                  {pastEvents.slice(0, 5).map(event => (
                    <div key={event.id} className="p-6 opacity-75">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                            <span>{event.location}</span>
                            <span>{event.currentParticipants} attended</span>
                          </div>
                        </div>
                        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          Completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1e3a8a]" />
                Community Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming</span>
                  <span className="font-semibold text-blue-600">{upcomingEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Participants</span>
                  <span className="font-semibold">{events.reduce((sum, event) => sum + event.currentParticipants, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-semibold text-green-600">{userStats?.activeMembersCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowCreateEvent(true)}
                  className="w-full bg-[#1e3a8a] text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Create Event
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Join Forum Discussion
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Member Directory
                </button>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1e3a8a]" />
                Community Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                    🏆
                  </div>
                  <div className="text-xs font-medium">Event Host</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                    👥
                  </div>
                  <div className="text-xs font-medium">Super Fan</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                    🎯
                  </div>
                  <div className="text-xs font-medium">Regular</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                    ⭐
                  </div>
                  <div className="text-xs font-medium">Helper</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Event description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newEvent.eventDate}
                  onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                <input
                  type="text"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Organizer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  value={newEvent.maxParticipants}
                  onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateEvent(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending}
                className="flex-1 bg-[#1e3a8a] text-white py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">{selectedEvent.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(selectedEvent.eventDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{selectedEvent.currentParticipants}/{selectedEvent.maxParticipants || '∞'} participants</span>
                </div>
                {selectedEvent.organizer && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Organizer: {selectedEvent.organizer}</span>
                  </div>
                )}
              </div>
              
              {selectedEvent.participants.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Participants ({selectedEvent.participants.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedEvent.participants.map(participant => (
                      <div key={participant.id} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{participant.user.displayName || 'Anonymous'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}