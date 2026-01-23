"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, CreditCard, Key, User2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/features/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/lib/redux/features/wishlistSlice";

interface ProductActionsProps {
    product: {
        id: number;
        title: string;
        price: string;
        originalPrice?: string;
        discount?: string;
        category: string;
        color: string;
        initials: string;
        rating?: number;
        availableTypes?: ("key" | "account")[];
        keyPrice?: string;
        accountPrice?: string;
    };
}

export function ProductActions({ product }: ProductActionsProps) {
    const dispatch = useAppDispatch();
    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);

    // Determine available types - default to both if not specified
    const availableTypes = product.availableTypes || ["key", "account"];
    const hasMultipleTypes = availableTypes.length > 1;

    // Default to the first available type
    const [selectedType, setSelectedType] = useState<"key" | "account">(availableTypes[0]);

    // Get the price based on selected type
    const getPrice = () => {
        if (selectedType === "key") {
            return product.keyPrice || product.price;
        } else {
            return product.accountPrice || product.price;
        }
    };

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: product.id,
                title: product.title,
                price: getPrice(),
                originalPrice: product.originalPrice,
                discount: product.discount,
                category: product.category,
                color: product.color,
                initials: product.initials,
                productType: selectedType,
            })
        );
    };

    const handleToggleWishlist = () => {
        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist({
                id: product.id,
                title: product.title,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                rating: product.rating,
                category: product.category,
                color: product.color,
                initials: product.initials,
            }));
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-8 border-b pb-8">
            {/* Product Type Selection - Only show if multiple types available */}
            {hasMultipleTypes && (
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                        Select Product Type:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {availableTypes.includes("key") && (
                            <button
                                type="button"
                                onClick={() => setSelectedType("key")}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedType === "key"
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${selectedType === "key" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                                    }`}>
                                    <Key className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-sm text-gray-900">Product Key</div>
                                    <div className="text-lg font-bold text-primary">
                                        {product.keyPrice || product.price}
                                    </div>
                                </div>
                            </button>
                        )}

                        {availableTypes.includes("account") && (
                            <button
                                type="button"
                                onClick={() => setSelectedType("account")}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedType === "account"
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${selectedType === "account" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                                    }`}>
                                    <User2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-sm text-gray-900">Account</div>
                                    <div className="text-lg font-bold text-primary">
                                        {product.accountPrice || product.price}
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 1. BUY NOW BUTTON */}
            <Button
                size="lg"
                className="w-full h-12 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all hover:scale-[1.01]"
            >
                <CreditCard className="w-5 h-5 mr-2" />
                Buy Now - {getPrice()}
            </Button>

            {/* 2. ADD TO CART ROW */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1 h-11 text-base gap-2 font-bold border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-900"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="lg"
                        className={`h-11 w-11 p-0 transition-colors ${isInWishlist
                            ? 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100'
                            : 'hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                            }`}
                        onClick={handleToggleWishlist}
                    >
                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-11 w-11 p-0 hover:bg-gray-50"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
