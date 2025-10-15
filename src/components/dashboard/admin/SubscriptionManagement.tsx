import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  payment_proof: string | null;
  profiles: {
    full_name: string;
    phone_number: string;
  };
}

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, profiles(full_name, phone_number)")
      .order("created_at", { ascending: false });

    if (data) setSubscriptions(data as any);
  };

  const updatePlan = async (id: string, newPlan: string) => {
    const { error: subError } = await supabase
      .from("subscriptions")
      .update({ plan: newPlan as "free" | "premium" | "admin", is_active: true })
      .eq("id", id);

    if (subError) {
      toast.error("Failed to update subscription");
      return;
    }

    // Update user role
    const sub = subscriptions.find((s) => s.id === id);
    if (sub) {
      await supabase.from("user_roles").delete().eq("user_id", sub.user_id);
      await supabase.from("user_roles").insert([{ 
        user_id: sub.user_id, 
        role: newPlan as "free" | "premium" | "admin" 
      }]);
    }

    toast.success("Subscription updated");
    fetchSubscriptions();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("subscriptions")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchSubscriptions();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>Manage user subscriptions and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.profiles?.full_name}</TableCell>
                <TableCell>{sub.profiles?.phone_number}</TableCell>
                <TableCell>
                  <Select value={sub.plan} onValueChange={(value) => updatePlan(sub.id, value)}>
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
                  <Badge variant={sub.is_active ? "default" : "secondary"}>
                    {sub.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(sub.id, sub.is_active)}
                  >
                    {sub.is_active ? "Deactivate" : "Activate"}
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