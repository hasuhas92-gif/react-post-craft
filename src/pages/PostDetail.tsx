import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`*, profiles:user_id (username)`)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      comedy: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      news: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      sports: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      technology: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      lifestyle: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
      other: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full rounded-lg" />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Button>

        <Card className="shadow-[var(--shadow-elevated)]">
          <CardHeader className="space-y-6">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-4xl font-bold leading-tight">
                {post.title}
              </h1>
              {user && post.user_id === user.id && (
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate()}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.profiles.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.body}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostDetail;
