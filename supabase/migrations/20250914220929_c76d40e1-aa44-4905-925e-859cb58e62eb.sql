-- Restrict public access to waitlist table to prevent email harvesting
-- Drop overly permissive policy allowing anyone to view waitlist emails
DROP POLICY IF EXISTS "Users can view waitlist entries" ON public.waitlist;

-- Allow only authenticated organizers to view waitlist emails
CREATE POLICY "Only organizers can view waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'organizer'
  )
);