"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { initializeCategories } from "@/lib/redux/features/categoriesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const categoriesInitialized = useAppSelector((state) => state.categories.initialized);

    useEffect(() => {
        if (!categoriesInitialized) {
            dispatch(initializeCategories());
        }
    }, [dispatch, categoriesInitialized]);

    const [formData, setFormData] = useState<Product>({
        id: nextId,
        title: "",
        price: "",
        originalPrice: "",
        discount: "",
        rating: undefined,
        category: "",
        color: COLOR_OPTIONS[0].value,
        initials: "",
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
                category: "",
                color: COLOR_OPTIONS[0].value,
                initials: "",
            });
        }
    }, [product, nextId, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Update the product details below." : "Fill in the details to create a new product."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded ${cat.color}`} />
                                                {cat.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price and Original Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    placeholder="$29.99"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="originalPrice">Original Price</Label>
                                <Input
                                    id="originalPrice"
                                    placeholder="$59.99"
                                    value={formData.originalPrice || ""}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Discount and Rating */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="discount">Discount</Label>
                                <Input
                                    id="discount"
                                    placeholder="-50%"
                                    value={formData.discount || ""}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rating">Rating (0-5)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    placeholder="4.5"
                                    value={formData.rating || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : undefined })
                                    }
                                />
                            </div>
                        </div>

                        {/* Color */}
                        <div className="grid gap-2">
                            <Label htmlFor="color">Color/Gradient *</Label>
                            <Select
                                value={formData.color}
                                onValueChange={(value) => setFormData({ ...formData, color: value })}
                                required
                            >
                                <SelectTrigger>
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

                        {/* Initials */}
                        <div className="grid gap-2">
                            <Label htmlFor="initials">Initials *</Label>
                            <Input
                                id="initials"
                                placeholder="GOW"
                                value={formData.initials}
                                onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                                maxLength={10}
                                required
                            />
                            <p className="text-xs text-gray-500">Short text displayed on product placeholder</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
