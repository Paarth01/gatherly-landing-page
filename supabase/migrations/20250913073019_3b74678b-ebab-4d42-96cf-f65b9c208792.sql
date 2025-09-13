-- Add cover_image column to events table
ALTER TABLE public.events 
ADD COLUMN cover_image TEXT;

-- Add verified column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false;

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Add foreign key constraints for reviews
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable Row Level Security on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for events they attended" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.rsvps 
    WHERE rsvps.event_id = reviews.event_id 
    AND rsvps.user_id = auth.uid() 
    AND rsvps.status = 'going'
  )
);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on reviews
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_reviews_event_id ON public.reviews(event_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Create storage bucket for event cover images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-covers', 'event-covers', true);

-- Create policies for event cover uploads
CREATE POLICY "Anyone can view event covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-covers');

CREATE POLICY "Organizers can upload event covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'event-covers' AND 
  auth.uid() IS NOT NULL AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'organizer'
);

CREATE POLICY "Organizers can update their event covers" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'event-covers' AND 
  auth.uid() IS NOT NULL AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'organizer'
);

CREATE POLICY "Organizers can delete their event covers" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'event-covers' AND 
  auth.uid() IS NOT NULL AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'organizer'
);