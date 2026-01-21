"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
    initializeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    Category,
} from "@/lib/redux/features/categoriesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";

const COLOR_OPTIONS = [
    { value: "bg-red-500", label: "Red" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-teal-500", label: "Teal" },
    { value: "bg-cyan-500", label: "Cyan" },
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-rose-500", label: "Rose" },
    { value: "bg-slate-500", label: "Slate" },
    { value: "bg-gray-500", label: "Gray" },
];

export default function CategoriesPage() {
    const dispatch = useAppDispatch();
    const categories = useAppSelector((state) => state.categories.items);
    const initialized = useAppSelector((state) => state.categories.initialized);
    const products = useAppSelector((state) => state.products.items);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("bg-blue-500");

    useEffect(() => {
        if (!initialized) {
            dispatch(initializeCategories());
        }
    }, [dispatch, initialized]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setColor("bg-blue-500");
        setEditingCategory(null);
    };

    const handleAddCategory = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setDescription(category.description || "");
        setColor(category.color);
        setIsDialogOpen(true);
    };

    const handleSaveCategory = () => {
        if (!name.trim()) return;

        const slug = name.toLowerCase().replace(/\s+/g, "-");

        if (editingCategory) {
            // Update existing category
            const updatedCategory: Category = {
                ...editingCategory,
                name: name.trim(),
                slug,
                description: description.trim() || undefined,
                color,
            };
            dispatch(updateCategory(updatedCategory));
        } else {
            // Add new category
            const newCategory: Category = {
                id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
                name: name.trim(),
                slug,
                description: description.trim() || undefined,
                color,
            };
            dispatch(addCategory(newCategory));
        }

        setIsDialogOpen(false);
        resetForm();
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;

        dispatch(deleteCategory(categoryToDelete.id));
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const getCategoryProductCount = (categoryName: string) => {
        return products.filter((p) => p.category === categoryName).length;
    };

    const isCategoryInUse = (categoryName: string) => {
        return getCategoryProductCount(categoryName) > 0;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Category Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage product categories - {categories.length} total categories
                            </p>
                        </div>
                        <Button onClick={handleAddCategory} size="lg">
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Category
                        </Button>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead className="w-24">Color</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-32">Products</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                        No categories available. Add your first category to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => {
                                    const productCount = getCategoryProductCount(category.name);
                                    return (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.id}
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className={`w-12 h-12 rounded ${category.color} flex items-center justify-center`}
                                                >
                                                    <Tag className="h-6 w-6 text-white" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {category.name}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {category.description || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                                                    {productCount} {productCount === 1 ? "product" : "products"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditCategory(category)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(category)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        disabled={isCategoryInUse(category.name)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Add/Edit Category Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCategory
                                    ? "Update the category information below."
                                    : "Create a new category for organizing your products."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Action Games"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of this category..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Select value={color} onValueChange={setColor}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded ${color}`} />
                                                <span>
                                                    {COLOR_OPTIONS.find((c) => c.value === color)?.label}
                                                </span>
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLOR_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded ${option.value}`} />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSaveCategory} disabled={!name.trim()}>
                                {editingCategory ? "Update" : "Add"} Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the category{" "}
                                <strong>{categoryToDelete?.name}</strong>. This action cannot be
                                undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
