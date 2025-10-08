import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Discover Amazing Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Read, write, and share your ideas with a community of passionate writers
          </p>
          
          <div className="mt-8 max-w-xs mx-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg text-muted-foreground">Failed to load posts. Please try again.</p>
          </div>
        )}

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {posts && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
