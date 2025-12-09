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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info as InfoIcon, Mail as MailIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { authService } from "@/services/auth.services";


export function LoginSignupDialog({ trigger }: { trigger: React.ReactNode }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlelogin = async() => {
    try {
      setLoading(true);
      const data = await authService.login({ email, password });
      console.log("Login success:", data);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed!");
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
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Mail Icon positioned absolutely inside the input field */}
              <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-transparent"
                    aria-label="Info"
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Password must be at least 8 characters</p>
                </TooltipContent>
              </Tooltip>
            </div>
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