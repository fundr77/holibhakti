import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentManagement from "./admin/ContentManagement";
import SubscriptionManagement from "./admin/SubscriptionManagement";
import UserManagement from "./admin/UserManagement";
import ChatManagement from "./admin/ChatManagement";
import PlanManagement from "./admin/PlanManagement";

const AdminDashboard = ({ user }: { user: User }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-2">Manage users, content, and subscriptions</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="subscriptions">Access</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <PlanManagement />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ChatManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;