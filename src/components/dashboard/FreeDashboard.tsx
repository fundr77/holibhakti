import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import ContentLibrary from "./premium/ContentLibrary";
import ClientChat from "./client/ClientChat";

const FreeDashboard = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Free Member Dashboard</h2>
        <p className="text-muted-foreground mt-2">Access free resources and upgrade for premium features</p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Upgrade to Premium</CardTitle>
          <CardDescription>
            Unlock personalized diet/exercise plans, advanced progress tracking, and premium content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/payment")}>
            View Premium Plans
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Free Resources</TabsTrigger>
          <TabsTrigger value="chat">Contact Coach</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <ContentLibrary />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ClientChat userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreeDashboard;