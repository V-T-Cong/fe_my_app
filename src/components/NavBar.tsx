"use client"

import Link from "next/link";
import { Globe, Menu, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { LoginSignupDialog } from "./LoginSignupDialog";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo/Site Title on the Left */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold inline-block text-xl">
            My App
          </span>
        </Link>

        {/* Right Section: "Become a host", Globe, and Hamburger Menu */}
        <div className="flex items-center space-x-2">
          {/* Become a host button (can be hidden on mobile if desired) */}
          <Button variant="ghost" className="hidden md:inline-flex text-sm font-medium">
            Become a host
          </Button>

          {/* Globe Icon Button */}
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change language and currency</span>
          </Button>

          {/* Hamburger Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full px-3 py-1.5 h-auto flex items-center space-x-2">
                <Menu className="h-4 w-4" />
                <User className="h-5 w-5" /> {/* User icon */}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[300px] p-2 mr-4"> {/* Adjust width as needed */}
              {/* Top Section */}
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Rich Content - "Become a host" card-like item */}
              <DropdownMenuItem className="flex items-start p-2">
                <div className="flex-1">
                  <DropdownMenuLabel className="font-semibold p-0">
                    Become a host
                  </DropdownMenuLabel>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    It&apos;s easy to start hosting and earn extra income.
                  </p>
                </div>
                {/* Small image on the right */}
                <span className="ml-4 w-12 h-12 shrink-0">
                  {/* You can replace this with an actual image. */}
                  {/* For now, a placeholder image will be generated */}

                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Other Navigation Items */}
              <DropdownMenuItem>Refer a Host</DropdownMenuItem>
              <DropdownMenuItem>Find a co-host</DropdownMenuItem>
              <DropdownMenuItem>Gift cards</DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Sign up / Log in */}
              <LoginSignupDialog trigger={
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                }}
                  className="cursor-pointer">

                    Log in or sign up
                </DropdownMenuItem>
              }/>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}