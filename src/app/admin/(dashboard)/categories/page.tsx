"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    type Category,
} from "@/lib/redux/features/categoriesSlice";
import { toast } from "sonner";
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

import { Plus, Pencil, Trash2, Tag, ChevronLeft, ChevronRight, Search } from "lucide-react";



export default function CategoriesPage() {
    const dispatch = useAppDispatch();
    const categories = useAppSelector((state) => state.categories.items);
    const loading = useAppSelector((state) => state.categories.loading);
    const error = useAppSelector((state) => state.categories.error);
    const currentPage = useAppSelector((state) => state.categories.currentPage);
    const totalPages = useAppSelector((state) => state.categories.totalPages);
    const totalElements = useAppSelector((state) => state.categories.totalElements);
    const pageSize = useAppSelector((state) => state.categories.pageSize);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#3b82f6");

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const isInitialMount = useRef(true);

    // Debounce search input (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch categories on mount and when search/page changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            dispatch(fetchCategories({ page: 0, size: pageSize }));
            return;
        }
        // When search changes, always go to page 0
        dispatch(fetchCategories({ page: 0, size: pageSize, search: debouncedSearch || undefined }));
    }, [dispatch, pageSize, debouncedSearch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setColor("#df8b05ff");
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

    const handleSaveCategory = async () => {
        if (!name.trim()) return;

        if (editingCategory) {
            // Update via API
            try {
                await dispatch(updateCategory({
                    id: editingCategory.id,
                    data: {
                        name: name.trim(),
                        description: description.trim(),
                        color,
                    },
                })).unwrap();
                toast.success("Category updated successfully");
            } catch {
                toast.error("Failed to update category");
                return;
            }
        } else {
            // Create via API
            try {
                await dispatch(createCategory({
                    name: name.trim(),
                    description: description.trim(),
                    color,
                })).unwrap();
                toast.success("Category created successfully");
                // Re-fetch current page to stay in sync
                dispatch(fetchCategories({ page: currentPage, size: pageSize, search: debouncedSearch || undefined }));
            } catch {
                toast.error("Failed to create category");
                return;
            }
        }

        setIsDialogOpen(false);
        resetForm();
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await dispatch(deleteCategory(categoryToDelete.id)).unwrap();
            toast.success("Category deleted successfully");
            // Re-fetch: if current page is empty after delete, go to previous page
            const goToPage = categories.length === 1 && currentPage > 0 ? currentPage - 1 : currentPage;
            dispatch(fetchCategories({ page: goToPage, size: pageSize, search: debouncedSearch || undefined }));
        } catch {
            toast.error("Failed to delete category");
        }
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
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
                                Manage product categories - {totalElements} total categories
                            </p>
                        </div>
                        <Button onClick={handleAddCategory} size="lg">
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Category
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search categories by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Color</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                                        {loading
                                            ? "Loading categories..."
                                            : debouncedSearch
                                                ? `No categories matching "${debouncedSearch}"`
                                                : "No categories available. Add your first category to get started."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <div
                                                className="w-12 h-12 rounded flex items-center justify-center"
                                                style={{ backgroundColor: category.color }}
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
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between bg-white rounded-lg shadow-sm px-6 py-4">
                        <p className="text-sm text-gray-600">
                            Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch(fetchCategories({ page: currentPage - 1, size: pageSize, search: debouncedSearch || undefined }))}
                                disabled={currentPage === 0 || loading}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i}
                                    variant={i === currentPage ? "default" : "outline"}
                                    size="sm"
                                    className="w-9"
                                    onClick={() => dispatch(fetchCategories({ page: i, size: pageSize, search: debouncedSearch || undefined }))}
                                    disabled={loading}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch(fetchCategories({ page: currentPage + 1, size: pageSize, search: debouncedSearch || undefined }))}
                                disabled={currentPage >= totalPages - 1 || loading}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

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
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            id="color"
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 hover:border-primary transition-colors [&::-webkit-color-swatch-wrapper]{padding:0} [&::-webkit-color-swatch]{border:none;border-radius:6px}"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={color}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                                    setColor(val);
                                                }
                                            }}
                                            placeholder="#3b82f6"
                                            className="font-mono text-sm uppercase"
                                            maxLength={7}
                                        />
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: color }}
                                    >
                                        <Tag className="h-5 w-5 text-white drop-shadow-sm" />
                                    </div>
                                </div>
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
                            <Button onClick={handleSaveCategory} disabled={!name.trim() || loading}>
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
