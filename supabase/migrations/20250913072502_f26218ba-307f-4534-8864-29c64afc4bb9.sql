-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('interested', 'going')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Add foreign key constraints
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policies for RSVPs
CREATE POLICY "Users can view all RSVPs" 
ON public.rsvps 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own RSVPs" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs" 
ON public.rsvps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs" 
ON public.rsvps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX idx_rsvps_user_id ON public.rsvps(user_id);
CREATE INDEX idx_rsvps_status ON public.rsvps(status);