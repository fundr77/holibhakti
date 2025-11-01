import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
}

interface Plan {
  id: string;
  user_id: string;
  plan_type: string;
  title: string;
  description: string | null;
  content: string;
  goals: string[] | null;
  start_date: string;
  is_active: boolean;
  profiles: {
    full_name: string | null;
  };
}

const PlanManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [planType, setPlanType] = useState("diet");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [goals, setGoals] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
    fetchPlans();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .order("full_name");
    
    if (data) setUsers(data);
  };

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("personalized_plans")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    
    if (data) setPlans(data as any);
  };

  const handleCreatePlan = async () => {
    if (!selectedUser || !title || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const goalsArray = goals.split('\n').filter(g => g.trim());

    const { error } = await supabase.from("personalized_plans").insert({
      user_id: selectedUser,
      created_by: currentUserId,
      plan_type: planType,
      title,
      description: description || null,
      content,
      goals: goalsArray.length > 0 ? goalsArray : null,
    });

    if (error) {
      toast.error("Failed to create plan");
    } else {
      toast.success("Plan created successfully");
      setSelectedUser("");
      setTitle("");
      setDescription("");
      setContent("");
      setGoals("");
      fetchPlans();
    }
  };

  const handleDeletePlan = async (id: string) => {
    const { error } = await supabase
      .from("personalized_plans")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete plan");
    } else {
      toast.success("Plan deleted successfully");
      fetchPlans();
    }
  };

  const togglePlanStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("personalized_plans")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update plan status");
    } else {
      toast.success("Plan status updated");
      fetchPlans();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Personalized Plan</CardTitle>
          <CardDescription>Create custom diet and exercise plans for your clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || "Unnamed User"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plan Type</label>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diet">Diet Plan</SelectItem>
                  <SelectItem value="exercise">Exercise Plan</SelectItem>
                  <SelectItem value="combined">Combined Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 30-Day Weight Loss Plan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the plan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Goals (one per line)</label>
            <Textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Lose 5kg&#10;Improve stamina&#10;Build muscle"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed plan content..."
              rows={8}
            />
          </div>

          <Button onClick={handleCreatePlan} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
          <CardDescription>Manage existing personalized plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.profiles?.full_name || "Unknown"}</TableCell>
                  <TableCell className="font-medium">{plan.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.plan_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(plan.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                    >
                      {plan.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanManagement;