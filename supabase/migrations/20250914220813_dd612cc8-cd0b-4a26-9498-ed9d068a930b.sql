-- Restrict public access to profiles table
-- Drop overly permissive policy allowing anyone to view profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow only authenticated users to view profiles
CREATE POLICY "Only authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
