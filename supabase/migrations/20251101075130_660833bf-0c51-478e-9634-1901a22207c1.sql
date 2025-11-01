-- Allow authenticated users to view admin roles so they can find admins to chat with
CREATE POLICY "Users can view admin roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (role = 'admin');