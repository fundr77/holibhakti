import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import UserAnalyticsReport from "./UserAnalyticsReport";

interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  health_category: string;
  created_at: string;
}

interface Subscription {
  user_id: string;
  plan: string;
  is_active: boolean;
}

const UserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: profilesData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: subsData } = await supabase.from("subscriptions").select("user_id, plan, is_active");

    if (profilesData) setProfiles(profilesData);
    if (subsData) setSubscriptions(subsData);
  };

  const getUserPlan = (userId: string) => {
    const sub = subscriptions.find((s) => s.user_id === userId && s.is_active);
    return sub?.plan || "free";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Health Category</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.full_name}</TableCell>
                <TableCell>{profile.phone_number}</TableCell>
                <TableCell>
                  <Badge variant="outline">{profile.health_category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getUserPlan(profile.id) === "premium" ? "default" : "secondary"}>
                    {getUserPlan(profile.id)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser({ id: profile.id, name: profile.full_name })}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {selectedUser && (
        <UserAnalyticsReport
          userId={selectedUser.id}
          userName={selectedUser.name}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}
    </Card>
  );
};

export default UserManagement;