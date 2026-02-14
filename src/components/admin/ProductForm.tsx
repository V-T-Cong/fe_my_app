import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { fetchCategories } from "@/lib/redux/features/categoriesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/redux/features/productsSlice";
import { Star } from "lucide-react";

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (product: Product) => void;
    product?: Product | null;
    nextId: number;
}

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

export function ProductForm({ open, onOpenChange, onSave, product, nextId }: ProductFormProps) {
    const dispatch = useAppDispatch();
    const categories = useAppSelector((state) => state.categories.items);
    const categoriesLoading = useAppSelector((state) => state.categories.loading);

    useEffect(() => {
        if (categories.length === 0 && !categoriesLoading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length, categoriesLoading]);

    const [formData, setFormData] = useState<Product>({
        id: nextId,
        title: "",
        price: "",
        originalPrice: "",
        discount: "",
        rating: undefined,
        categories: [],
        color: COLOR_OPTIONS[0].value,
        initials: "",
        images: [],
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                id: nextId,
                title: "",
                price: "",
                originalPrice: "",
                discount: "",
                rating: undefined,
                categories: [],
                color: COLOR_OPTIONS[0].value,
                initials: "",
                images: [],
            });
        }
    }, [product, nextId, open]);

    const handleCategoryToggle = (categoryName: string) => {
        const currentCategories = formData.categories || [];
        if (currentCategories.includes(categoryName)) {
            setFormData({
                ...formData,
                categories: currentCategories.filter((c) => c !== categoryName),
            });
        } else {
            setFormData({
                ...formData,
                categories: [...currentCategories, categoryName],
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
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
                            className={`h-5 w-5 ${star <= rating
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {product ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? "Update the product information below."
                            : "Fill in the details to create a new product."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        {/* Product Images */}
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Product Images</Label>
                            <ImageUpload
                                images={formData.images || []}
                                onChange={(images) => setFormData({ ...formData, images })}
                                maxImages={5}
                            />
                        </div>

                        {/* Two Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Epic Adventure Game"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-gray-50"
                                    />
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price">
                                        Price <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <Input
                                            id="price"
                                            placeholder="0.00"
                                            value={formData.price.replace('$', '')}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: `$${e.target.value.replace('$', '')}` })
                                            }
                                            className="pl-7 bg-gray-50"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Original Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="originalPrice">Original Price (optional)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                                            className="pl-7 bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Discount */}
                                <div className="space-y-2">
                                    <Label htmlFor="discount">Discount (%)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                                            className="pl-7 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Categories */}
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Categories</Label>
                                    <div className="border rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                                        <div className="space-y-3">
                                            {categories.map((cat) => (
                                                <div key={cat.id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`category-${cat.id}`}
                                                        checked={formData.categories?.includes(cat.name) || false}
                                                        onCheckedChange={() => handleCategoryToggle(cat.name)}
                                                    />
                                                    <label
                                                        htmlFor={`category-${cat.id}`}
                                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                                    >
                                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                                                        <span className="text-sm font-medium">{cat.name}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color/Gradient */}
                                <div className="space-y-2">
                                    <Label htmlFor="color">Color / Gradient</Label>
                                    <Select
                                        value={formData.color}
                                        onValueChange={(value) => setFormData({ ...formData, color: value })}
                                    >
                                        <SelectTrigger className="bg-gray-50">
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
                                        <Label htmlFor="initials">
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
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-2">
                                        <Label>Rating</Label>
                                        {renderStarRating()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Categories Badges */}
                        {formData.categories && formData.categories.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-600">Selected Categories:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.categories.map((catName) => {
                                        const category = categories.find((c) => c.name === catName);
                                        return (
                                            <span
                                                key={catName}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                                                style={{ backgroundColor: category?.color || '#6b7280' }}
                                            >
                                                {catName}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryToggle(catName)}
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

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary">
                            {product ? "Update Product" : "Add Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
