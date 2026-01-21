"use client"

import Link from "next/link";
import { Menu, User, Search, ShoppingCart, Bell, Gamepad2, Monitor, Gift, Repeat, Crown } from "lucide-react";
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
import { useAppSelector } from "@/lib/redux/hooks";

export function NavBar() {
  const cartTotalItems = useAppSelector((state) => state.cart.totalItems);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">

      {/* ==================== UPPER SECTION (Search & Actions) ==================== */}
      <div className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-40 gap-4">

          {/* 1. LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-extrabold text-2xl text-primary tracking-tighter">
              GamerKeys
            </span>
          </Link>

          {/* 2. SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-2xl px-4">
            <div className="flex items-center w-full rounded-md border-2 border-gray-100 focus-within:border-primary/50 overflow-hidden bg-gray-50 transition-colors">
              <input
                type="text"
                placeholder="Minecraft, Windows 11, Pubg..."
                className="grow bg-transparent outline-none text-sm px-4 py-2.5 text-gray-700 placeholder:text-gray-400"
              />
              <button className="bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors font-medium text-sm flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* 3. ACTIONS */}
          <div className="flex items-center space-x-1 shrink-0">
            <Button variant="ghost" className="hidden lg:inline-flex font-semibold text-gray-600">
              Sell Keys
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-600 hidden sm:inline-flex">
              <Bell className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-primary mr-2">
                <ShoppingCart className="h-5 w-5" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    {cartTotalItems}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full px-2 py-1.5 h-auto flex items-center gap-2 border-gray-200 hover:bg-gray-50">
                  <Menu className="h-4 w-4 ml-1" />
                  <div className="bg-gray-200 rounded-full p-1 text-gray-600">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60 mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Orders</DropdownMenuItem>
                <Link href="/wishlist">
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/admin/products">
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <LoginSignupDialog trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer font-bold text-primary">
                    Log in / Sign up
                  </DropdownMenuItem>
                } />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ==================== LOWER SECTION (Categories) ==================== */}
      {/* Added border-b to bottom of this section */}
      <div className="hidden md:block bg-white border-b">
        <div className="container mx-auto px-40">
          <nav className="flex items-center justify-between w-full h-12 text-sm font-medium text-gray-600">

            <Link href="/category/gaming" className="flex items-center hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary h-full">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Gaming
            </Link>

            <Link href="/category/software" className="flex items-center hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary h-full">
              <Monitor className="w-4 h-4 mr-2" />
              Software
            </Link>

            <Link href="/category/gift-cards" className="flex items-center hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary h-full">
              <Gift className="w-4 h-4 mr-2" />
              Gift Cards
            </Link>

            <Link href="/category/subscriptions" className="flex items-center hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary h-full">
              <Repeat className="w-4 h-4 mr-2" />
              Subscriptions
            </Link>

            {/* GOLD MEMBERSHIP HIGHLIGHT */}
            <Link href="/category/membership" className="flex items-center text-amber-500 hover:text-amber-600 font-bold transition-colors border-b-2 border-transparent hover:border-amber-500 h-full">
              <Crown className="w-4 h-4 mr-2" />
              Membership
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}