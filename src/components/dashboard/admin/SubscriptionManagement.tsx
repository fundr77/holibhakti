import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface UserWithAccess {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  subscription: {
    id: string;
    plan: string;
    is_active: boolean;
    start_date: string;
  } | null;
  role: string;
}

const SubscriptionManagement = () => {
  const [users, setUsers] = useState<UserWithAccess[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    fetchCurrentUser();
    fetchAllUsers();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchAllUsers = async () => {
    // Fetch all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone_number")
      .order("created_at", { ascending: false });

    if (!profiles) return;

    // Fetch subscriptions for all users
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("id, user_id, plan, is_active, start_date");

    // Fetch roles for all users
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    // Combine the data
    const usersWithAccess = profiles.map(profile => {
      const subscription = subscriptions?.find(s => s.user_id === profile.id);
      const role = roles?.find(r => r.user_id === profile.id);
      
      return {
        id: profile.id,
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        subscription: subscription || null,
        role: role?.role || 'free'
      };
    });

    setUsers(usersWithAccess);
  };

  const updateUserAccess = async (userId: string, newPlan: string) => {
    // Update or create subscription
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingSub) {
      await supabase
        .from("subscriptions")
        .update({ plan: newPlan as "free" | "premium" | "admin", is_active: true })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("subscriptions")
        .insert({ 
          user_id: userId, 
          plan: newPlan as "free" | "premium" | "admin",
          is_active: true 
        });
    }

    // Update user role
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert([{ 
      user_id: userId, 
      role: newPlan as "free" | "premium" | "admin" 
    }]);

    toast.success("User access updated");
    fetchAllUsers();
  };

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("subscriptions")
      .update({ is_active: !currentStatus })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchAllUsers();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Access Management</CardTitle>
        <CardDescription>Manage all user access levels and platform permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.filter(u => u.id !== currentUserId).map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || "Unnamed User"}</TableCell>
                <TableCell>{user.phone_number || "N/A"}</TableCell>
                <TableCell>
                  <Select 
                    value={user.role} 
                    onValueChange={(value) => updateUserAccess(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={user.subscription?.is_active ? "default" : "secondary"}>
                    {user.subscription?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.subscription?.start_date 
                    ? new Date(user.subscription.start_date).toLocaleDateString()
                    : "Not set"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(user.id, user.subscription?.is_active || false)}
                  >
                    {user.subscription?.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;