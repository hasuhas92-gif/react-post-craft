import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPost, updatePost } from "@/lib/api";
import Navbar from "@/components/Navbar";
import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(Number(id)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title: string; body: string; userId: number }) =>
      updatePost(Number(id), data),
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
          initialData={{ title: post.title, body: post.body }}
          onSubmit={(data) => updateMutation.mutateAsync(data)}
          isLoading={updateMutation.isPending}
          submitText="Update Post"
        />
      </main>
    </div>
  );
};

export default EditPost;
