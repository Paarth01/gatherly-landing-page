import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart, UserCheck, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import EventFilters from "@/components/EventFilters";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  created_by: string;
  cover_image: string | null;
  profiles: {
    name: string;
    verified: boolean;
  };
  rsvps?: {
    id: string;
    status: string;
    user_id: string;
  }[];
  reviews?: {
    id: string;
    rating: number;
  }[];
}

const AttendeeDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, selectedLocation]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_created_by_fkey(name, verified),
          rsvps(id, status, user_id),
          reviews(id, rating)
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

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedLocation("");
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

  const getAverageRating = (event: Event) => {
    if (!event.reviews || event.reviews.length === 0) return 0;
    const sum = event.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / event.reviews.length;
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

      {/* Filters */}
      <div className="mb-8">
        <EventFilters
          searchValue={searchTerm}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onLocationChange={setSelectedLocation}
          onClearFilters={clearFilters}
        />
      </div>

      {filteredEvents.length === 0 ? (
        events.length === 0 ? (
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
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events match your filters</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clearing filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const userRsvp = getUserRSVP(event);
            const { interested, going } = getRSVPCounts(event);
            const averageRating = getAverageRating(event);
            
            return (
              <Card key={event.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                {event.cover_image && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={event.cover_image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    <div className="flex gap-2">
                      {userRsvp && (
                        <Badge 
                          variant={userRsvp.status === 'going' ? 'default' : 'outline'}
                          className="capitalize"
                        >
                          {userRsvp.status}
                        </Badge>
                      )}
                      {event.profiles.verified && (
                        <Badge variant="outline" className="text-primary border-primary">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {event.description}
                  </CardDescription>
                  
                  {averageRating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({event.reviews?.length} review{event.reviews?.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent 
                  className="space-y-4"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${event.id}`);
                      }}
                      className="flex-1 gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    
                    {userRsvp ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRSVP(event.id);
                        }}
                        disabled={rsvpLoading === event.id}
                      >
                        Remove RSVP
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRSVP(event.id, 'interested');
                          }}
                          disabled={rsvpLoading === event.id}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRSVP(event.id, 'going');
                          }}
                          disabled={rsvpLoading === event.id}
                        >
                          <UserCheck className="h-4 w-4" />
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