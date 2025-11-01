import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Dumbbell, Target } from "lucide-react";

interface Plan {
  id: string;
  plan_type: string;
  title: string;
  description: string | null;
  content: string;
  goals: string[] | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

const PersonalizedPlans = ({ userId }: { userId: string }) => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchPlans();
  }, [userId]);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("personalized_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) setPlans(data);
  };

  const dietPlans = plans.filter(p => p.plan_type === 'diet');
  const exercisePlans = plans.filter(p => p.plan_type === 'exercise');
  const combinedPlans = plans.filter(p => p.plan_type === 'combined');

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <Badge variant="default">Active</Badge>
        </div>
        {plan.description && (
          <CardDescription>{plan.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.goals && plan.goals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Goals</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {plan.goals.map((goal, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">{goal}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <span className="font-medium text-sm block mb-2">Plan Details</span>
          <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm">
            {plan.content}
          </div>
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Start: {new Date(plan.start_date).toLocaleDateString()}</span>
          {plan.end_date && (
            <span>End: {new Date(plan.end_date).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personalized Plans</CardTitle>
        <CardDescription>Custom diet and exercise plans created by your coach</CardDescription>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No active plans yet. Your coach will create personalized plans for you.</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({plans.length})</TabsTrigger>
              <TabsTrigger value="diet">
                <Utensils className="h-4 w-4 mr-2" />
                Diet ({dietPlans.length})
              </TabsTrigger>
              <TabsTrigger value="exercise">
                <Dumbbell className="h-4 w-4 mr-2" />
                Exercise ({exercisePlans.length})
              </TabsTrigger>
              <TabsTrigger value="combined">Combined ({combinedPlans.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 space-y-4">
              {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
            </TabsContent>

            <TabsContent value="diet" className="mt-6 space-y-4">
              {dietPlans.length > 0 ? (
                dietPlans.map(plan => <PlanCard key={plan.id} plan={plan} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No diet plans available
                </div>
              )}
            </TabsContent>

            <TabsContent value="exercise" className="mt-6 space-y-4">
              {exercisePlans.length > 0 ? (
                exercisePlans.map(plan => <PlanCard key={plan.id} plan={plan} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No exercise plans available
                </div>
              )}
            </TabsContent>

            <TabsContent value="combined" className="mt-6 space-y-4">
              {combinedPlans.length > 0 ? (
                combinedPlans.map(plan => <PlanCard key={plan.id} plan={plan} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No combined plans available
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedPlans;