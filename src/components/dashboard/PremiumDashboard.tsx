import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentLibrary from "./premium/ContentLibrary";
import AnalyticsTracker from "./premium/AnalyticsTracker";

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

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content Library</TabsTrigger>
          <TabsTrigger value="analytics">My Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <ContentLibrary healthCategory={profile?.health_category} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTracker userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumDashboard;