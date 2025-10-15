import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";

interface Content {
  id: string;
  title: string;
  description: string;
  content_type: string;
  file_url: string;
  health_category: string;
  is_published: boolean;
}

const ContentManagement = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [open, setOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content_type: "freebie",
    file_url: "",
    health_category: "general",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from("content").select("*").order("created_at", { ascending: false });
    if (data) setContent(data);
  };

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("content").insert([{
      title: newContent.title,
      description: newContent.description,
      content_type: newContent.content_type as "freebie" | "premium_video",
      file_url: newContent.file_url,
      health_category: newContent.health_category as any,
      created_by: user?.id || null,
    }]);

    if (error) {
      toast.error("Failed to create content");
    } else {
      toast.success("Content created successfully");
      setOpen(false);
      setNewContent({
        title: "",
        description: "",
        content_type: "freebie",
        file_url: "",
        health_category: "general",
      });
      fetchContent();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete content");
    } else {
      toast.success("Content deleted");
      fetchContent();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Create and manage wellness content</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>Add new content for your users</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newContent.description}
                    onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select
                    value={newContent.content_type}
                    onValueChange={(value) => setNewContent({ ...newContent, content_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freebie">Freebie</SelectItem>
                      <SelectItem value="premium_video">Premium Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health_category">Health Category</Label>
                  <Select
                    value={newContent.health_category}
                    onValueChange={(value) => setNewContent({ ...newContent, health_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="thyroid">Thyroid</SelectItem>
                      <SelectItem value="ulcerative_colitis">Ulcerative Colitis</SelectItem>
                      <SelectItem value="pcod">PCOD</SelectItem>
                      <SelectItem value="high_blood_pressure">High Blood Pressure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file_url">File URL</Label>
                  <Input
                    id="file_url"
                    type="url"
                    placeholder="https://..."
                    value={newContent.file_url}
                    onChange={(e) => setNewContent({ ...newContent, file_url: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Create Content
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.content_type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.health_category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.is_published ? "default" : "destructive"}>
                    {item.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4" />
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

export default ContentManagement;