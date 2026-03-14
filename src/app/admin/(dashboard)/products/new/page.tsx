"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { categoryService } from "@/services/category.services";
import { productService } from "@/services/product.services";
import type { Category, CreateVariantDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Upload,
    X,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const MAX_IMAGES = 10;

    // Images state (multiple)
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        discountPercent: 0,
        categoryIds: [] as string[],
    });

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    // Variants
    const [variants, setVariants] = useState<CreateVariantDTO[]>([
        { type: "KEY", price: 0, variantName: "", discountPrice: 0 },
    ]);

    // Fetch categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await categoryService.getAll(0, 1000);
                setCategories(response.content);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    const handleCategoryToggle = (categoryId: string) => {
        if (formData.categoryIds.includes(categoryId)) {
            setFormData({
                ...formData,
                categoryIds: formData.categoryIds.filter((id) => id !== categoryId),
            });
        } else {
            setFormData({
                ...formData,
                categoryIds: [...formData.categoryIds, categoryId],
            });
        }
    };

    const handleImageSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        const fileArray = Array.from(files).filter((file) => {
            if (!validTypes.includes(file.type)) {
                alert(`Invalid file type: ${file.name}. Only JPG, PNG, and WebP are allowed.`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`File too large: ${file.name}. Maximum size is 5MB.`);
                return false;
            }
            return true;
        });

        if (imageFiles.length + fileArray.length > MAX_IMAGES) {
            alert(`Maximum ${MAX_IMAGES} images allowed. You can only add ${MAX_IMAGES - imageFiles.length} more.`);
            return;
        }

        // Read previews for valid files
        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setImageFiles((prev) => [...prev, ...fileArray]);
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // Variant management
    const addVariant = () => {
        setVariants([
            ...variants,
            { type: "KEY", price: 0, variantName: "", discountPrice: 0 },
        ]);
    };

    const removeVariant = (index: number) => {
        if (variants.length <= 1) return;
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: keyof CreateVariantDTO, value: string | number) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        setVariants(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name.trim()) {
            setError("Product name is required.");
            return;
        }
        if (formData.categoryIds.length === 0) {
            setError("Please select at least one category.");
            return;
        }
        if (variants.some((v) => !v.variantName.trim())) {
            setError("All variants must have a name.");
            return;
        }
        if (variants.some((v) => v.price <= 0)) {
            setError("All variants must have a price greater than 0.");
            return;
        }

        try {
            setSubmitting(true);
            await productService.create({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    discountPercent: formData.discountPercent,
                    categoryIds: formData.categoryIds,
                    variants: variants,
                });
            router.push("/admin/products");
        } catch (err: any) {
            console.error("Failed to create product:", err);
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to create product. Please try again.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-full bg-gray-50">
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

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                        {/* Product Images */}
                        <div className="space-y-3">
                            <Label className="text-lg font-semibold">Product Images</Label>
                            <p className="text-sm text-gray-500">{imageFiles.length} / {MAX_IMAGES} images uploaded</p>

                            {/* Upload area */}
                            {imageFiles.length < MAX_IMAGES && (
                                <div
                                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-primary hover:bg-gray-50"
                                    onClick={() => imageInputRef.current?.click()}
                                >
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            handleImageSelect(e.target.files);
                                            e.target.value = "";
                                        }}
                                    />
                                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        JPG, PNG or WebP (max 5MB per file, up to {MAX_IMAGES} images)
                                    </p>
                                </div>
                            )}

                            {/* Image Previews Grid */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                                        >
                                            <img
                                                src={preview}
                                                alt={`Product image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Remove
                                                </Button>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {imagePreviews.length === 0 && (
                                <div className="text-center py-4 text-gray-400">
                                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No images uploaded yet</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-8" />

                        {/* Two Column Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Basic Info */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base">
                                        Product Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Elden Ring: Shadow of the Erdtree"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({
                                                ...formData,
                                                name,
                                                slug: generateSlug(name),
                                            });
                                        }}
                                        required
                                        className="bg-gray-50 h-12 text-base"
                                    />
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-base">
                                        Slug <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        placeholder="e.g. elden-ring-shadow-erdtree"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                        className="bg-gray-50 h-12 text-base"
                                    />
                                    <p className="text-xs text-gray-400">Auto-generated from name. You can edit it manually.</p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-base">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter product description..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-gray-50 text-base min-h-[120px]"
                                        rows={4}
                                    />
                                </div>

                                {/* Discount Percent */}
                                <div className="space-y-2">
                                    <Label htmlFor="discountPercent" className="text-base">
                                        Discount (%)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
                                            %
                                        </span>
                                        <Input
                                            id="discountPercent"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            placeholder="0.00"
                                            value={formData.discountPercent || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    discountPercent: parseFloat(e.target.value) || 0,
                                                })
                                            }
                                            className="pl-8 bg-gray-50 h-12 text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Categories */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>

                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">
                                        Select Categories <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                                        {categoriesLoading ? (
                                            <div className="flex items-center justify-center py-8 text-gray-400">
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                Loading categories...
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {categories.map((cat) => (
                                                    <div key={cat.id} className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={`category-${cat.id}`}
                                                            checked={formData.categoryIds.includes(cat.id)}
                                                            onCheckedChange={() => handleCategoryToggle(cat.id)}
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
                                        )}
                                    </div>
                                </div>

                                {/* Selected Categories Badges */}
                                {formData.categoryIds.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm text-gray-600">Selected:</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.categoryIds.map((catId) => {
                                                const category = categories.find((c) => c.id === catId);
                                                return (
                                                    <span
                                                        key={catId}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                                                        style={{ backgroundColor: category?.color || "#6b7280" }}
                                                    >
                                                        {category?.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCategoryToggle(catId)}
                                                            className="hover:bg-white/20 rounded-full p-0.5"
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
                        </div>

                        <div className="border-t pt-8" />

                        {/* Variants Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Product Variants</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Add different variants (e.g., Key, Account) with their pricing and stock
                                    </p>
                                </div>
                                <Button type="button" variant="outline" onClick={addVariant}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Variant
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-5 bg-gray-50 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-gray-700">
                                                Variant #{index + 1}
                                            </h3>
                                            {variants.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeVariant(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Variant Name */}
                                            <div className="space-y-2">
                                                <Label className="text-sm">
                                                    Variant Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Standard Key"
                                                    value={variant.variantName}
                                                    onChange={(e) =>
                                                        updateVariant(index, "variantName", e.target.value)
                                                    }
                                                    className="bg-white"
                                                    required
                                                />
                                            </div>

                                            {/* Type */}
                                            <div className="space-y-2">
                                                <Label className="text-sm">Type</Label>
                                                <select
                                                    value={variant.type}
                                                    onChange={(e) =>
                                                        updateVariant(index, "type", e.target.value)
                                                    }
                                                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    <option value="KEY">Key</option>
                                                    <option value="ACCOUNT">Account</option>
                                                </select>
                                            </div>

                                            {/* Price */}
                                            <div className="space-y-2">
                                                <Label className="text-sm">
                                                    Price ($) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={variant.price || ""}
                                                    onChange={(e) =>
                                                        updateVariant(index, "price", parseFloat(e.target.value) || 0)
                                                    }
                                                    className="bg-white"
                                                    required
                                                />
                                            </div>

                                            {/* Discount Price */}
                                            <div className="space-y-2">
                                                <Label className="text-sm">Discount Price ($)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={variant.discountPrice || ""}
                                                    onChange={(e) =>
                                                        updateVariant(index, "discountPrice", parseFloat(e.target.value) || 0)
                                                    }
                                                    className="bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Link href="/admin/products">
                            <Button type="button" variant="outline" size="lg" disabled={submitting}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" size="lg" className="bg-primary px-8" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
