"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addProduct, initializeProducts } from "@/lib/redux/features/productsSlice";
import { fetchCategories } from "@/lib/redux/features/categoriesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

const COLOR_OPTIONS = [
    { name: "Yellow-Red", value: "bg-gradient-to-br from-yellow-600 to-red-800" },
    { name: "Yellow", value: "bg-gradient-to-br from-yellow-400 to-yellow-600" },
    { name: "Green", value: "bg-gradient-to-br from-green-500 to-green-700" },
    { name: "Blue", value: "bg-gradient-to-br from-blue-700 to-slate-800" },
    { name: "Blue-Cyan", value: "bg-gradient-to-br from-blue-400 to-blue-600" },
    { name: "Orange-Red", value: "bg-gradient-to-br from-orange-500 to-red-600" },
    { name: "Blue-Cyan-2", value: "bg-gradient-to-br from-blue-600 to-cyan-500" },
    { name: "Purple", value: "bg-gradient-to-br from-indigo-500 to-purple-600" },
    { name: "Gray", value: "bg-gradient-to-br from-gray-700 to-gray-900" },
    { name: "Teal-Cyan", value: "bg-gradient-to-br from-teal-400 to-cyan-600" },
    { name: "Orange-Red-2", value: "bg-gradient-to-br from-orange-400 to-red-500" },
    { name: "Blue-Dark", value: "bg-gradient-to-br from-blue-900 to-black" },
    { name: "Green-2", value: "bg-gradient-to-br from-green-500 to-green-700" },
    { name: "Gray-Light", value: "bg-gradient-to-br from-gray-200 to-gray-400" },
];

export default function NewProductPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products.items);
    const categories = useAppSelector((state) => state.categories.items);
    const productsInitialized = useAppSelector((state) => state.products.initialized);
    const categoriesLoading = useAppSelector((state) => state.categories.loading);

    // Initialize products and categories
    useEffect(() => {
        if (!productsInitialized) {
            dispatch(initializeProducts());
        }
        if (categories.length === 0 && !categoriesLoading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, productsInitialized, categories.length, categoriesLoading]);

    const [formData, setFormData] = useState({
        id: 1,
        title: "",
        price: "",
        originalPrice: "",
        discount: "",
        rating: undefined as number | undefined,
        categories: [] as string[],
        color: COLOR_OPTIONS[0].value,
        initials: "",
        images: [] as string[],
        availableTypes: ["key", "account"] as ("key" | "account")[],
        keyPrice: "",
        accountPrice: "",
    });

    // Update the product ID when products are loaded
    useEffect(() => {
        if (productsInitialized && products.length > 0) {
            const nextId = Math.max(...products.map((p) => p.id)) + 1;
            setFormData((prev) => ({ ...prev, id: nextId }));
        }
    }, [productsInitialized, products]);

    const handleCategoryToggle = (categoryName: string) => {
        if (formData.categories.includes(categoryName)) {
            setFormData({
                ...formData,
                categories: formData.categories.filter((c: string) => c !== categoryName),
            });
        } else {
            setFormData({
                ...formData,
                categories: [...formData.categories, categoryName],
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Convert form data to proper Product type
        const newProduct = {
            id: formData.id,
            title: formData.title,
            price: formData.price,
            originalPrice: formData.originalPrice || undefined,
            discount: formData.discount || undefined,
            rating: formData.rating,
            category: formData.categories[0] || "General",
            categories: formData.categories,
            color: formData.color,
            initials: formData.initials,
            images: formData.images,
            availableTypes: formData.availableTypes,
            keyPrice: formData.keyPrice || formData.price,
            accountPrice: formData.accountPrice || formData.price,
        };
        dispatch(addProduct(newProduct));
        router.push("/admin/products");
    };

    const renderStarRating = () => {
        const rating = formData.rating || 0;
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none transition-colors"
                    >
                        <Star
                            className={`h-6 w-6 ${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/products">
                        <Button variant="outline" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600 mt-2">Fill in the details to create a new product</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                        {/* Product Images */}
                        <div className="space-y-3">
                            <Label className="text-lg font-semibold">Product Images</Label>
                            <ImageUpload
                                images={formData.images}
                                onChange={(images) => setFormData({ ...formData, images })}
                                maxImages={5}
                            />
                        </div>

                        <div className="border-t pt-8" />

                        {/* Two Column Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-base">
                                        Product Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Epic Adventure Game"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-gray-50 h-12 text-base"
                                    />
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-base">
                                        Price <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
                                            $
                                        </span>
                                        <Input
                                            id="price"
                                            placeholder="0.00"
                                            value={formData.price.replace('$', '')}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: `$${e.target.value.replace('$', '')}` })
                                            }
                                            className="pl-8 bg-gray-50 h-12 text-base"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Original Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="originalPrice" className="text-base">Original Price (optional)</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
                                            $
                                        </span>
                                        <Input
                                            id="originalPrice"
                                            placeholder="0.00"
                                            value={formData.originalPrice?.replace('$', '') || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    originalPrice: e.target.value ? `$${e.target.value.replace('$', '')}` : "",
                                                })
                                            }
                                            className="pl-8 bg-gray-50 h-12 text-base"
                                        />
                                    </div>
                                </div>

                                {/* Discount */}
                                <div className="space-y-2">
                                    <Label htmlFor="discount" className="text-base">Discount (%)</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
                                            %
                                        </span>
                                        <Input
                                            id="discount"
                                            placeholder="0"
                                            value={formData.discount?.replace('%', '').replace('-', '') || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    discount: e.target.value ? `-${e.target.value.replace('%', '').replace('-', '')}%` : "",
                                                })
                                            }
                                            className="pl-8 bg-gray-50 h-12 text-base"
                                        />
                                    </div>
                                </div>

                                {/* Product Types */}
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Available Product Types</Label>
                                    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="type-key"
                                                checked={formData.availableTypes.includes("key")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setFormData({
                                                            ...formData,
                                                            availableTypes: [...formData.availableTypes, "key"],
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            availableTypes: formData.availableTypes.filter(t => t !== "key"),
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor="type-key" className="cursor-pointer text-base font-medium">
                                                Keys
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="type-account"
                                                checked={formData.availableTypes.includes("account")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setFormData({
                                                            ...formData,
                                                            availableTypes: [...formData.availableTypes, "account"],
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            availableTypes: formData.availableTypes.filter(t => t !== "account"),
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor="type-account" className="cursor-pointer text-base font-medium">
                                                Accounts
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Price */}
                                {formData.availableTypes.includes("key") && (
                                    <div className="space-y-2">
                                        <Label htmlFor="keyPrice" className="text-base">Key Price</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
                                                $
                                            </span>
                                            <Input
                                                id="keyPrice"
                                                placeholder="0.00"
                                                value={formData.keyPrice.replace('$', '')}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, keyPrice: `$${e.target.value.replace('$', '')}` })
                                                }
                                                className="pl-8 bg-gray-50 h-12 text-base"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Account Price */}
                                {formData.availableTypes.includes("account") && (
                                    <div className="space-y-2">
                                        <Label htmlFor="accountPrice" className="text-base">Account Price</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
                                                $
                                            </span>
                                            <Input
                                                id="accountPrice"
                                                placeholder="0.00"
                                                value={formData.accountPrice.replace('$', '')}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, accountPrice: `$${e.target.value.replace('$', '')}` })
                                                }
                                                className="pl-8 bg-gray-50 h-12 text-base"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Classification & Display</h2>

                                {/* Categories */}
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Categories</Label>
                                    <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                                        <div className="space-y-3">
                                            {categories.map((cat) => (
                                                <div key={cat.id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`category-${cat.id}`}
                                                        checked={formData.categories.includes(cat.name)}
                                                        onCheckedChange={() => handleCategoryToggle(cat.name)}
                                                    />
                                                    <label
                                                        htmlFor={`category-${cat.id}`}
                                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                                    >
                                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }} />
                                                        <span className="text-base font-medium">{cat.name}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color/Gradient */}
                                <div className="space-y-2">
                                    <Label htmlFor="color" className="text-base">Color / Gradient</Label>
                                    <Select
                                        value={formData.color}
                                        onValueChange={(value) => setFormData({ ...formData, color: value })}
                                    >
                                        <SelectTrigger className="bg-gray-50 h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COLOR_OPTIONS.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded ${color.value}`} />
                                                        {color.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Initials and Rating Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Initials */}
                                    <div className="space-y-2">
                                        <Label htmlFor="initials" className="text-base">
                                            Initials <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="initials"
                                            placeholder="e.g. EA"
                                            value={formData.initials}
                                            onChange={(e) =>
                                                setFormData({ ...formData, initials: e.target.value.toUpperCase() })
                                            }
                                            maxLength={10}
                                            required
                                            className="bg-gray-50 h-12 text-base"
                                        />
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-2">
                                        <Label className="text-base">Rating</Label>
                                        {renderStarRating()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Categories Badges */}
                        {formData.categories.length > 0 && (
                            <div className="space-y-3 pt-6 border-t">
                                <Label className="text-base text-gray-600">Selected Categories:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.categories.map((catName) => {
                                        const category = categories.find((c) => c.name === catName);
                                        return (
                                            <span
                                                key={catName}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
                                                style={{ backgroundColor: category?.color || '#6b7280' }}
                                            >
                                                {catName}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryToggle(catName)}
                                                    className="hover:bg-white/20 rounded-full p-0.5 text-lg"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Link href="/admin/products">
                            <Button type="button" variant="outline" size="lg">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" size="lg" className="bg-primary px-8">
                            Add Product
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
