import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  profiles: {
    name: string;
  };
  created_at?: string;
}

interface ReviewSectionProps {
  eventId: string;
  reviews: Review[];
  onReviewAdded: () => void;
  isPastEvent: boolean;
  userRsvp?: { status: string } | null;
}

const ReviewSection = ({ eventId, reviews, onReviewAdded, isPastEvent, userRsvp }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const userReview = reviews.find(review => review.user_id === user?.id);
  const canReview = user && isPastEvent && userRsvp?.status === 'going' && !userReview;

  const handleSubmitReview = async () => {
    if (!user || rating === 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          event_id: eventId,
          user_id: user.id,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setRating(0);
      setComment("");
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating: currentRating, interactive = false, onRatingChange }: { 
    rating: number; 
    interactive?: boolean; 
    onRatingChange?: (rating: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= currentRating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews ({reviews.length})
            </CardTitle>
            {reviews.length > 0 && (
              <CardDescription className="flex items-center gap-2 mt-2">
                <StarRating rating={parseFloat(averageRating)} />
                <span>{averageRating} out of 5 stars</span>
              </CardDescription>
            )}
          </div>
          
          {canReview && (
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
              size="sm"
            >
              Write Review
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Review Form */}
        {showReviewForm && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <StarRating 
                rating={rating} 
                interactive 
                onRatingChange={setRating}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
              <Textarea
                placeholder="Share your thoughts about this event..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet</p>
            {canReview && (
              <p className="text-sm mt-2">Be the first to review this event!</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-3 p-4 border rounded-lg">
                <Avatar>
                  <AvatarFallback>
                    {review.profiles.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.profiles.name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.created_at && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                  
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        {!canReview && user && (
          <div className="text-sm text-muted-foreground text-center py-4 border-t">
            {!isPastEvent && "You can review this event after it ends."}
            {isPastEvent && userRsvp?.status !== 'going' && "Only attendees who marked 'going' can review events."}
            {isPastEvent && userReview && "You've already reviewed this event."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSection;