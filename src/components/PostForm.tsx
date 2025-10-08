import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface PostFormProps {
  initialData?: {
    title: string;
    body: string;
    category?: string;
  };
  onSubmit: (data: { title: string; body: string; category: string }) => Promise<any>;
  isLoading?: boolean;
  submitText?: string;
}

const PostForm = ({ initialData, onSubmit, isLoading, submitText = "Publish" }: PostFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [category, setCategory] = useState(initialData?.category || "other");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, body, category });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Your Story</CardTitle>
        <CardDescription>Share your thoughts with the world</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              placeholder="Tell your story..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={12}
              className="resize-none"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
