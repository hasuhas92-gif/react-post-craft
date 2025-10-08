import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    body: string;
    category: string;
    created_at: string;
    profiles: {
      username: string;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
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

  return (
    <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className={getCategoryColor(post.category)}>
            {post.category}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-xl font-bold leading-tight">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">
          {post.body}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{post.profiles.username}</span>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-2 group-hover:gap-3 transition-all">
          <Link to={`/post/${post.id}`}>
            Read More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
