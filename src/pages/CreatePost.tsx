import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPost } from "@/lib/api";
import Navbar from "@/components/Navbar";
import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/post/${data.id}`);
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

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
