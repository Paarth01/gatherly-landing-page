import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Heart, UserCheck, Star, ArrowLeft, Share2, ExternalLink, Shield } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import ReviewSection from "@/components/ReviewSection";
import SocialShare from "@/components/SocialShare";

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
    profiles: {
      name: string;
    };
  }[];
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    user_id: string;
    profiles: {
      name: string;
    };
  }[];
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_created_by_fkey(name, verified),
          rsvps(
            id,
            status,
            user_id,
            profiles(name)
          ),
          reviews(
            id,
            rating,
            comment,
            user_id,
            profiles(name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status: 'interested' | 'going') => {
    if (!user?.id) {
      toast.error('Please sign in to RSVP');
      navigate('/auth');
      return;
    }
    
    setRsvpLoading(true);
    try {
      const existingRsvp = event?.rsvps?.find(rsvp => rsvp.user_id === user.id);

      if (existingRsvp) {
        const { error } = await supabase
          .from('rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);

        if (error) throw error;
        toast.success(`RSVP updated to ${status}`);
      } else {
        const { error } = await supabase
          .from('rsvps')
          .insert({
            event_id: id!,
            user_id: user.id,
            status
          });

        if (error) throw error;
        toast.success(`RSVP set to ${status}`);
      }

      fetchEvent();
    } catch (error) {
      console.error('Error handling RSVP:', error);
      toast.error('Failed to update RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  const removeRSVP = async () => {
    if (!user?.id) return;
    
    setRsvpLoading(true);
    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('event_id', id!)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('RSVP removed');
      fetchEvent();
    } catch (error) {
      console.error('Error removing RSVP:', error);
      toast.error('Failed to remove RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  const getUserRSVP = () => {
    return event?.rsvps?.find(rsvp => rsvp.user_id === user?.id);
  };

  const getRSVPCounts = () => {
    const interested = event?.rsvps?.filter(rsvp => rsvp.status === 'interested').length || 0;
    const going = event?.rsvps?.filter(rsvp => rsvp.status === 'going').length || 0;
    return { interested, going };
  };

  const getAverageRating = () => {
    if (!event?.reviews || event.reviews.length === 0) return 0;
    const sum = event.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / event.reviews.length;
  };

  const getMapUrl = (location: string) => {
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(location)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Event not found</h3>
            <p className="text-muted-foreground mb-4">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/events')}>
              Browse Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRsvp = getUserRSVP();
  const { interested, going } = getRSVPCounts();
  const averageRating = getAverageRating();
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <Card>
            <CardHeader>
              {event.cover_image && (
                <div className="w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{event.category}</Badge>
                <div className="flex gap-2">
                  <SocialShare 
                    title={event.title}
                    url={window.location.href}
                  />
                  {isPastEvent && (
                    <Badge variant="outline">Past Event</Badge>
                  )}
                </div>
              </div>

              <CardTitle className="text-2xl md:text-3xl">{event.title}</CardTitle>
              
              {averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({event.reviews?.length} review{event.reviews?.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Event Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(event.date), 'EEEE, MMMM d')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View on Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* RSVP Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {interested} interested
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {going} going
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About this event</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* Map Placeholder */}
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Map integration coming soon</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <ReviewSection 
            eventId={event.id} 
            reviews={event.reviews || []}
            onReviewAdded={fetchEvent}
            isPastEvent={isPastEvent}
            userRsvp={userRsvp}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* RSVP Card */}
          {!isPastEvent && (
            <Card>
              <CardHeader>
                <CardTitle>RSVP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userRsvp ? (
                  <>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Badge 
                        variant={userRsvp.status === 'going' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        You're {userRsvp.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {userRsvp.status !== 'interested' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRSVP('interested')}
                          disabled={rsvpLoading}
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Interested
                        </Button>
                      )}
                      {userRsvp.status !== 'going' && (
                        <Button
                          size="sm"
                          onClick={() => handleRSVP('going')}
                          disabled={rsvpLoading}
                          className="flex-1"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Going
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeRSVP}
                      disabled={rsvpLoading}
                      className="w-full"
                    >
                      Remove RSVP
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => handleRSVP('interested')}
                      disabled={rsvpLoading}
                      className="w-full gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Interested
                    </Button>
                    <Button
                      onClick={() => handleRSVP('going')}
                      disabled={rsvpLoading}
                      className="w-full gap-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      Going
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Organizer Card */}
          <Card>
            <CardHeader>
              <CardTitle>Organized by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {event.profiles.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{event.profiles.name}</p>
                    {event.profiles.verified && (
                      <Shield className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendees Card */}
          {going > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Who's Going ({going})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.rsvps
                    ?.filter(rsvp => rsvp.status === 'going')
                    .slice(0, 5)
                    .map((rsvp) => (
                      <div key={rsvp.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {rsvp.profiles.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{rsvp.profiles.name}</span>
                      </div>
                    ))}
                  {going > 5 && (
                    <p className="text-sm text-muted-foreground">
                      +{going - 5} more attendees
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;