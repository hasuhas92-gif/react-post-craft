import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
      <CardHeader>
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
          <span>User {post.userId}</span>
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
