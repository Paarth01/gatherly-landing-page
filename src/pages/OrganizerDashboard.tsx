import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Plus, Edit, Trash2, Eye, Heart, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  created_by: string;
  rsvps?: {
    id: string;
    status: string;
    user_id: string;
    profiles: {
      name: string;
    };
  }[];
}

const OrganizerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchMyEvents();
  }, [user]);

  const fetchMyEvents = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          rsvps(
            id,
            status,
            user_id,
            profiles(name)
          )
        `)
        .eq('created_by', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('created_by', user?.id); // Ensure user can only delete their own events

      if (error) throw error;
      toast.success('Event deleted successfully');
      fetchMyEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const getRSVPCounts = (event: Event) => {
    const interested = event.rsvps?.filter(rsvp => rsvp.status === 'interested').length || 0;
    const going = event.rsvps?.filter(rsvp => rsvp.status === 'going').length || 0;
    return { interested, going };
  };

  const RSVPDialog = ({ event }: { event: Event }) => {
    const interestedUsers = event.rsvps?.filter(rsvp => rsvp.status === 'interested') || [];
    const goingUsers = event.rsvps?.filter(rsvp => rsvp.status === 'going') || [];

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>RSVPs for {event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {goingUsers.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Going ({goingUsers.length})
              </h4>
              <div className="space-y-1">
                {goingUsers.map((rsvp) => (
                  <div key={rsvp.id} className="text-sm text-muted-foreground">
                    {rsvp.profiles.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {interestedUsers.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Interested ({interestedUsers.length})
              </h4>
              <div className="space-y-1">
                {interestedUsers.map((rsvp) => (
                  <div key={rsvp.id} className="text-sm text-muted-foreground">
                    {rsvp.profiles.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!goingUsers.length && !interestedUsers.length && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No RSVPs yet
            </p>
          )}
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Organizer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your events and track RSVPs
          </p>
        </div>
        <Button onClick={() => navigate('/create-event')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first event to bring people together!
            </p>
            <Button onClick={() => navigate('/create-event')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const { interested, going } = getRSVPCounts(event);
            const isPastEvent = new Date(event.date) < new Date();
            
            return (
              <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    {isPastEvent && (
                      <Badge variant="outline">Past Event</Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.date), 'PPP p')}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {interested} interested
                    </div>
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-4 w-4" />
                      {going} going
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View RSVPs
                        </Button>
                      </DialogTrigger>
                      <RSVPDialog event={event} />
                    </Dialog>
                    
                    {!isPastEvent && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this event?')) {
                              deleteEvent(event.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;