
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthSettings } from "@/contexts/AuthSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const { settings } = useAuthSettings();
  const [email, setEmail] = useState(settings.defaultEmail || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(settings.autoLogin);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto login if enabled
  useEffect(() => {
    const performAutoLogin = async () => {
      if (settings.autoLogin) {
        setIsLoading(true);
        try {
          // Use default credentials
          const success = await login(settings.defaultEmail, settings.defaultRole === "admin" ? "admin123" : "worker123");
          if (success) {
            navigate("/dashboard");
            toast({
              title: "Auto Login Successful",
              description: `Logged in as ${settings.defaultEmail}`,
            });
          }
        } catch (error) {
          console.error("Auto login failed:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    performAutoLogin();
  }, [settings.autoLogin, settings.defaultEmail, settings.defaultRole, login, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-savvy-primary dark:text-savvy-accent">Stock Savvy</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Smart inventory management
          </p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Log in to your account</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Enter your credentials below to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stocksavvy.com"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  Remember me
                </Label>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Demo accounts:</p>
                <p>Admin: admin@stocksavvy.com / admin123</p>
                <p>Worker: worker@stocksavvy.com / worker123</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-savvy-primary hover:bg-savvy-primary/90 dark:bg-savvy-accent dark:hover:bg-savvy-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
