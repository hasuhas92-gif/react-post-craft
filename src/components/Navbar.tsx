import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenSquare, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <PenSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BlogHub
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button size="sm" asChild className="gap-2">
                  <Link to="/create">
                    <PenSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">New Post</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
