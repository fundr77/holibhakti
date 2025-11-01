import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentLibrary from "./premium/ContentLibrary";
import AnalyticsTracker from "./premium/AnalyticsTracker";
import PersonalizedPlans from "./client/PersonalizedPlans";
import ProgressTracker from "./client/ProgressTracker";
import ClientChat from "./client/ClientChat";

const PremiumDashboard = ({ user }: { user: User }) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    };

    fetchProfile();
  }, [user.id]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Welcome back, {profile?.full_name}!</h2>
        <p className="text-muted-foreground mt-2">Premium Member - Full access to all features</p>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="tracker">Daily Log</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="content">Resources</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <PersonalizedPlans userId={user.id} />
        </TabsContent>

        <TabsContent value="tracker" className="mt-6">
          <AnalyticsTracker userId={user.id} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProgressTracker userId={user.id} />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentLibrary healthCategory={profile?.health_category} />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ClientChat userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumDashboard;