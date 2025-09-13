import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  created_by: string;
  profiles: {
    name: string;
  };
  rsvps?: {
    id: string;
    status: string;
    user_id: string;
  }[];
}

const AttendeeDashboard = () => {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_created_by_fkey(name),
          rsvps(id, status, user_id)
        `)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'interested' | 'going') => {
    if (!user?.id) return;
    
    setRsvpLoading(eventId);
    try {
      // Check if user already has an RSVP
      const { data: existingRsvp } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from('rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);

        if (error) throw error;
        toast.success(`RSVP updated to ${status}`);
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('rsvps')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status
          });

        if (error) throw error;
        toast.success(`RSVP set to ${status}`);
      }

      fetchEvents(); // Refresh events to show updated RSVP status
    } catch (error) {
      console.error('Error handling RSVP:', error);
      toast.error('Failed to update RSVP');
    } finally {
      setRsvpLoading(null);
    }
  };

  const removeRSVP = async (eventId: string) => {
    if (!user?.id) return;
    
    setRsvpLoading(eventId);
    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('RSVP removed');
      fetchEvents();
    } catch (error) {
      console.error('Error removing RSVP:', error);
      toast.error('Failed to remove RSVP');
    } finally {
      setRsvpLoading(null);
    }
  };

  const getUserRSVP = (event: Event) => {
    return event.rsvps?.find(rsvp => rsvp.user_id === user?.id);
  };

  const getRSVPCounts = (event: Event) => {
    const interested = event.rsvps?.filter(rsvp => rsvp.status === 'interested').length || 0;
    const going = event.rsvps?.filter(rsvp => rsvp.status === 'going').length || 0;
    return { interested, going };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-muted-foreground">
          Discover amazing events happening around you
        </p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events available</h3>
            <p className="text-muted-foreground">
              Check back later for new events in your area!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const userRsvp = getUserRSVP(event);
            const { interested, going } = getRSVPCounts(event);
            
            return (
              <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    {userRsvp && (
                      <Badge 
                        variant={userRsvp.status === 'going' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        {userRsvp.status}
                      </Badge>
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
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Organized by {event.profiles.name}
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
                    {userRsvp ? (
                      <>
                        {userRsvp.status !== 'interested' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRSVP(event.id, 'interested')}
                            disabled={rsvpLoading === event.id}
                            className="flex-1"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Interested
                          </Button>
                        )}
                        {userRsvp.status !== 'going' && (
                          <Button
                            size="sm"
                            onClick={() => handleRSVP(event.id, 'going')}
                            disabled={rsvpLoading === event.id}
                            className="flex-1"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Going
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRSVP(event.id)}
                          disabled={rsvpLoading === event.id}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRSVP(event.id, 'interested')}
                          disabled={rsvpLoading === event.id}
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Interested
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRSVP(event.id, 'going')}
                          disabled={rsvpLoading === event.id}
                          className="flex-1"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Going
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

export default AttendeeDashboard;