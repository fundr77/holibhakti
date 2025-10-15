import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Content {
  id: string;
  title: string;
  description: string;
  file_url: string;
  content_type: string;
  health_category: string;
}

const ContentLibrary = ({ healthCategory }: { healthCategory?: string }) => {
  const [content, setContent] = useState<Content[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content")
        .select("*")
        .eq("is_published", true);

      if (data) setContent(data);
    };

    fetchContent();
  }, []);

  const filteredContent = healthCategory && healthCategory !== "general"
    ? content.filter((item) => item.health_category === healthCategory || item.health_category === "general")
    : content;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Content Library</CardTitle>
        <CardDescription>
          {healthCategory && healthCategory !== "general"
            ? `Personalized content for ${healthCategory}`
            : "All available content"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {item.content_type === "premium_video" ? (
                    <Video className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{item.content_type}</Badge>
                  <Badge variant="outline">{item.health_category}</Badge>
                </div>
                <CardDescription className="mt-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full" asChild>
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                    Access Content
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;