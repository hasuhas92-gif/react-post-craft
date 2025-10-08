import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const CreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; body: string; category: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data: post, error } = await supabase
        .from("posts")
        .insert([{
          title: data.title,
          body: data.body,
          category: data.category as any,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return post;
    },
    onSuccess: (data) => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/post/${data.id}`);
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <PostForm
          onSubmit={(data) => createMutation.mutateAsync(data)}
          isLoading={createMutation.isPending}
          submitText="Publish Post"
        />
      </main>
    </div>
  );
};

export default CreatePost;
