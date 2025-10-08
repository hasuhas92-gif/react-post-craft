import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (post && user && post.user_id !== user.id) {
      toast.error("You can only edit your own posts");
      navigate("/");
    }
  }, [post, user, navigate]);

  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; body: string; category: string }) => {
      const { error } = await supabase
        .from("posts")
        .update({
          title: data.title,
          body: data.body,
          category: data.category as any,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate(`/post/${id}`);
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

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
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/post/${id}`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <PostForm
          initialData={{ title: post.title, body: post.body, category: post.category }}
          onSubmit={(data) => updateMutation.mutateAsync(data)}
          isLoading={updateMutation.isPending}
          submitText="Update Post"
        />
      </main>
    </div>
  );
};

export default EditPost;
