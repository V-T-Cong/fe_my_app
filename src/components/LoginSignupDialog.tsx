// components/LoginSignupDialog.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authService } from "@/services/auth.services";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation"
import { AxiosError } from "axios";


export function LoginSignupDialog({ trigger }: { trigger: React.ReactNode }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const isValidEmail = (email: string) => {
    // This regex checks for characters + @ + characters + . + characters
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlelogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password. ");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login({ email, password });
      console.log("Login success:", data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        // Fallback for other errors (500, network issues, etc.)
        setError("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    // Wrap with TooltipProvider for the info icon tooltip to work
    <TooltipProvider>
      <Dialog>
        {/* 1. DialogTrigger wraps the element that opens the modal. */}
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>

        {/* 2. Dialog Content (The Modal) */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log In or Sign Up</DialogTitle>
            <DialogDescription>
              Enter your email below to log in or create an account.
            </DialogDescription>
          </DialogHeader>

          {/* Corrected Form Content */}
          <div className="grid gap-4 py-4">

            <div className="relative">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="pr-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("");
                }}
              />

              <Button 
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* Switch icon based on state */}
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" onClick={handlelogin} disabled={loading}>{loading ? "Loading..." : "Continue"}</Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <FcGoogle className="h-5 w-5 mr-3" />
            Continue with Google
          </Button>

        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}