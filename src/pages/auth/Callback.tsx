import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Store, CheckCircle, XCircle } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Set up auth state listener
        const {
          data: { subscription },
        } = onAuthStateChange((user) => {
          if (user) {
            // Check if user has completed profile setup
            if (user.role && user.city && user.area) {
              // User is fully set up, redirect to dashboard
              toast({
                title: "Welcome to Westgate!",
                description: `Successfully signed in as ${user.name}`,
              });

              switch (user.role) {
                case "customer":
                  navigate("/customer");
                  break;
                case "retailer":
                  navigate("/retailer");
                  break;
                case "service-provider":
                  navigate("/service-provider");
                  break;
                default:
                  navigate("/");
              }
            } else {
              // User needs to complete profile setup
              navigate("/signup?step=role");
            }
          } else {
            setError("Authentication failed. Please try again.");
            setIsLoading(false);
          }
        });

        // Also check current auth state immediately
        const currentUser = getCurrentUser();
        if (currentUser) {
          if (currentUser.role && currentUser.city && currentUser.area) {
            switch (currentUser.role) {
              case "customer":
                navigate("/customer");
                break;
              case "retailer":
                navigate("/retailer");
                break;
              case "service-provider":
                navigate("/service-provider");
                break;
              default:
                navigate("/");
            }
          } else {
            navigate("/signup?step=role");
          }
        }

        // Clean up subscription
        return () => {
          subscription?.unsubscribe();
        };
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed");
        setIsLoading(false);
      }
    };

    // Add a delay to ensure auth state is properly handled
    const timer = setTimeout(() => {
      handleAuthCallback();
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-red-900">
                Authentication Failed
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate("/login")} className="w-full">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-7 w-7" />
              </div>
            </div>
            <CardTitle>Completing Sign In</CardTitle>
            <CardDescription>
              Please wait while we set up your account...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">
                Setting up your account
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;
