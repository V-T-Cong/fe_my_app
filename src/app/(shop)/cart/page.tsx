"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { removeFromCart, updateQuantity, clearCart } from "@/lib/redux/features/cartSlice";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const totalItems = useAppSelector((state) => state.cart.totalItems);

    // Track which items are selected for checkout
    const [selectedItems, setSelectedItems] = useState<Set<number>>(
        new Set(cartItems.map(item => item.id))
    );

    const handleRemoveItem = (id: number) => {
        dispatch(removeFromCart(id));
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };

    const handleUpdateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        setSelectedItems(new Set());
    };

    const toggleItemSelection = (id: number) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map(item => item.id)));
        }
    };

    // Calculate subtotal for selected items only
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.has(item.id)) {
                const price = parseFloat(item.price.replace("$", ""));
                return total + price * item.quantity;
            }
            return total;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    const selectedCount = selectedItems.size;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        {cartItems.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearCart}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Clear Cart
                            </Button>
                        )}
                    </div>
                    <p className="text-gray-600 mt-2">
                        {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    // Empty Cart State
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven't added any products yet.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="font-semibold">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    // Cart with Items
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items - Left Column */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Select All Checkbox */}
                            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
                                <Checkbox
                                    id="select-all"
                                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                />
                                <label
                                    htmlFor="select-all"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Select All ({cartItems.length} items)
                                </label>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Checkbox */}
                                        <div className="flex items-start pt-2">
                                            <Checkbox
                                                id={`item-${item.id}`}
                                                checked={selectedItems.has(item.id)}
                                                onCheckedChange={() => toggleItemSelection(item.id)}
                                            />
                                        </div>

                                        {/* Product Image */}
                                        <Link href={`/product/${item.id}`} className="shrink-0">
                                            <div
                                                className={`w-32 h-32 rounded-lg ${item.color} flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
                                            >
                                                <span className="text-white font-bold text-xl opacity-70">
                                                    {item.initials}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/product/${item.id}`}
                                                        className="font-bold text-lg text-gray-900 hover:text-primary line-clamp-2 mb-1 block"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-block text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                            {item.category}
                                                        </span>
                                                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${item.productType === "key"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-purple-100 text-purple-700"
                                                            }`}>
                                                            {item.productType === "key" ? "🔑 Key" : "👤 Account"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            <div className="flex items-baseline gap-3 mb-4">
                                                <span className="text-2xl font-bold text-primary">
                                                    {item.price}
                                                </span>
                                                {item.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {item.originalPrice}
                                                    </span>
                                                )}
                                                {item.discount && (
                                                    <span className="text-sm font-semibold text-red-600">
                                                        {item.discount}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Quantity:
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-9 w-9"
                                                        onClick={() =>
                                                            handleUpdateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-base font-bold w-12 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-9 w-9"
                                                        onClick={() =>
                                                            handleUpdateQuantity(item.id, item.quantity + 1)
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <span className="text-sm text-gray-600 ml-auto">
                                                    Subtotal:{" "}
                                                    <span className="font-bold text-gray-900">
                                                        $
                                                        {(
                                                            parseFloat(item.price.replace("$", "")) *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary - Right Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal ({selectedCount} selected)</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Estimated Tax (10%)</span>
                                        <span className="font-semibold">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-primary">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 text-base font-bold mb-3"
                                    size="lg"
                                    disabled={selectedCount === 0}
                                >
                                    Proceed to Checkout ({selectedCount})
                                </Button>

                                <Link href="/">
                                    <Button variant="outline" className="w-full" size="lg">
                                        Continue Shopping
                                    </Button>
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-600 font-bold">✓</span>
                                        </div>
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-bold">⚡</span>
                                        </div>
                                        <span>Instant Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <span className="text-purple-600 font-bold">🛡️</span>
                                        </div>
                                        <span>Money Back Guarantee</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
