"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { removeFromCart, updateQuantity } from "@/lib/redux/features/cartSlice";
import { toast } from "sonner";
import Link from "next/link";

export function CartSidebar() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const totalItems = useAppSelector((state) => state.cart.totalItems);

    const handleRemoveItem = (id: number, title: string) => {
        dispatch(removeFromCart(id));
        toast.success("Removed from cart", {
            description: `${title} has been removed from your cart.`,
        });
    };

    const handleUpdateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace("$", ""));
            return total + price * item.quantity;
        }, 0);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:text-primary mr-2"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </SheetTitle>
                </SheetHeader>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Add some products to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    {/* Product Image/Placeholder */}
                                    <div
                                        className={`w-20 h-20 rounded-md ${item.color} flex items-center justify-center shrink-0`}
                                    >
                                        <span className="text-white font-bold text-sm opacity-70">
                                            {item.initials}
                                        </span>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="font-semibold text-sm text-gray-900 hover:text-primary line-clamp-2 mb-1"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-primary">
                                                {item.price}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    {item.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() =>
                                                    handleUpdateQuantity(item.id, item.quantity - 1)
                                                }
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm font-semibold w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() =>
                                                    handleUpdateQuantity(item.id, item.quantity + 1)
                                                }
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveItem(item.id, item.title)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Total and Checkout */}
                {cartItems.length > 0 && (
                    <SheetFooter className="border-t pt-4 flex-col gap-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <Button className="w-full h-12 text-base font-bold" size="lg">
                            Proceed to Checkout
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                // Close the sheet by clicking outside or use a state
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
