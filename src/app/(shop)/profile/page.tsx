"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    Heart,
    CreditCard,
    Settings,
    ArrowLeft,
    Edit
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ProfilePage() {
    const cartItems = useAppSelector((state) => state.cart.totalItems);
    const wishlistItems = useAppSelector((state) => state.wishlist.totalItems);

    // Mock user data - in a real app, this would come from authentication/database
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        joinDate: "January 2024",
        membershipLevel: "Gold Member",
        avatar: "JD",
    };

    const stats = [
        { label: "Orders", value: "12", icon: ShoppingBag, color: "text-blue-600" },
        { label: "Wishlist", value: wishlistItems.toString(), icon: Heart, color: "text-red-600" },
        { label: "Cart Items", value: cartItems.toString(), icon: ShoppingBag, color: "text-green-600" },
    ];

    const recentOrders = [
        { id: "#12345", date: "Jan 15, 2024", total: "$89.99", status: "Delivered" },
        { id: "#12344", date: "Jan 10, 2024", total: "$49.99", status: "Delivered" },
        { id: "#12343", date: "Jan 5, 2024", total: "$129.99", status: "Processing" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Store
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                                            {user.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-xl">{user.name}</CardTitle>
                                <CardDescription>
                                    <Badge variant="secondary" className="mt-2">
                                        {user.membershipLevel}
                                    </Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">{user.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">Joined {user.joinDate}</span>
                                </div>
                                <Separator />
                                <Button className="w-full" variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                            <span className="text-sm text-gray-700">{stat.label}</span>
                                        </div>
                                        <span className="font-bold text-lg">{stat.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Orders</CardTitle>
                                        <CardDescription>Your latest purchase history</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary/10 p-3 rounded-lg">
                                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.id}</p>
                                                    <p className="text-sm text-gray-500">{order.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{order.total}</p>
                                                <Badge
                                                    variant={order.status === "Delivered" ? "default" : "secondary"}
                                                    className="mt-1"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                                <CardDescription>Manage your account preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Button variant="outline" className="justify-start h-auto py-4">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-gray-500" />
                                            <div className="text-left">
                                                <p className="font-semibold">Payment Methods</p>
                                                <p className="text-xs text-gray-500">Manage cards & payment</p>
                                            </div>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="justify-start h-auto py-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <div className="text-left">
                                                <p className="font-semibold">Addresses</p>
                                                <p className="text-xs text-gray-500">Shipping addresses</p>
                                            </div>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="justify-start h-auto py-4">
                                        <div className="flex items-center gap-3">
                                            <Settings className="h-5 w-5 text-gray-500" />
                                            <div className="text-left">
                                                <p className="font-semibold">Preferences</p>
                                                <p className="text-xs text-gray-500">Notifications & privacy</p>
                                            </div>
                                        </div>
                                    </Button>
                                    <Link href="/wishlist" className="w-full">
                                        <Button variant="outline" className="w-full justify-start h-auto py-4">
                                            <div className="flex items-center gap-3">
                                                <Heart className="h-5 w-5 text-gray-500" />
                                                <div className="text-left">
                                                    <p className="font-semibold">Wishlist</p>
                                                    <p className="text-xs text-gray-500">{wishlistItems} saved items</p>
                                                </div>
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
