import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Content {
  id: string;
  title: string;
  description: string;
  file_url: string;
  content_type: string;
}

const FreeDashboard = ({ user }: { user: User }) => {
  const [content, setContent] = useState<Content[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content")
        .select("*")
        .eq("content_type", "freebie")
        .eq("is_published", true);

      if (data) setContent(data);
    };

    fetchContent();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Welcome to Your Wellness Journey</h2>
          <p className="text-muted-foreground mt-2">Free Plan - Access to wellness resources</p>
        </div>
        <Button onClick={() => navigate("/payment")}>Upgrade to Premium</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Free Resources</CardTitle>
          <CardDescription>Access your complimentary wellness materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                      View Resource
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle>Unlock Premium Features</CardTitle>
          <CardDescription>Get access to personalized coaching and premium content</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              <span>Access to all premium video content</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Personalized analytics tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>One-on-one coaching sessions</span>
            </li>
          </ul>
          <Button onClick={() => navigate("/payment")}>Upgrade Now</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeDashboard;