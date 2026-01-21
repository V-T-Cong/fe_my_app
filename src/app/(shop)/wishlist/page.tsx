"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { removeFromWishlist, clearWishlist } from "@/lib/redux/features/wishlistSlice";
import { addToCart } from "@/lib/redux/features/cartSlice";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const dispatch = useAppDispatch();
    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const totalItems = useAppSelector((state) => state.wishlist.totalItems);

    const handleRemoveItem = (id: number) => {
        dispatch(removeFromWishlist(id));
    };

    const handleClearWishlist = () => {
        dispatch(clearWishlist());
    };

    const handleAddToCart = (item: typeof wishlistItems[0]) => {
        dispatch(
            addToCart({
                id: item.id,
                title: item.title,
                price: item.price,
                originalPrice: item.originalPrice,
                discount: item.discount,
                category: item.category,
                color: item.color,
                initials: item.initials,
            })
        );
    };

    const handleMoveToCart = (item: typeof wishlistItems[0]) => {
        handleAddToCart(item);
        handleRemoveItem(item.id);
    };

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
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                                My Wishlist
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {totalItems} {totalItems === 1 ? "item" : "items"} saved for later
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearWishlist}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Clear Wishlist
                            </Button>
                        )}
                    </div>
                </div>

                {wishlistItems.length === 0 ? (
                    // Empty Wishlist State
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Save your favorite items for later!
                        </p>
                        <Link href="/">
                            <Button size="lg" className="font-semibold">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    // Wishlist Items Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Product Image */}
                                <Link href={`/product/${item.id}`} className="block relative">
                                    <div
                                        className={`h-48 w-full ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                                    >
                                        <span className="text-white font-bold text-xl opacity-70">
                                            {item.initials}
                                        </span>
                                    </div>
                                    {item.discount && (
                                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            {item.discount}
                                        </div>
                                    )}
                                </Link>

                                {/* Product Details */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {item.category}
                                        </span>
                                        {item.rating && (
                                            <div className="flex items-center text-amber-400 text-xs font-bold">
                                                <span className="mr-1">★</span>
                                                {item.rating}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/product/${item.id}`}
                                        className="font-bold text-gray-900 hover:text-primary line-clamp-2 mb-3 block min-h-[3rem]"
                                    >
                                        {item.title}
                                    </Link>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-xl font-bold text-primary">
                                            {item.price}
                                        </span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {item.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        <Button
                                            className="w-full font-semibold"
                                            size="sm"
                                            onClick={() => handleMoveToCart(item)}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Move to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                {wishlistItems.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                    Ready to checkout?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Add all items to your cart and proceed to checkout
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        wishlistItems.forEach((item) => handleAddToCart(item));
                                    }}
                                >
                                    Add All to Cart
                                </Button>
                                <Link href="/cart">
                                    <Button>Go to Cart</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
