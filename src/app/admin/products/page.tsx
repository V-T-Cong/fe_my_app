"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
    initializeProducts,
    deleteProduct,
    Product,
} from "@/lib/redux/features/productsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Search, Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products.items);
    const initialized = useAppSelector((state) => state.products.initialized);

    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        if (!initialized) {
            dispatch(initializeProducts());
        }
    }, [dispatch, initialized]);

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categories?.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );



    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            dispatch(deleteProduct(productToDelete.id));
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                            <p className="text-gray-600 mt-2">
                                Manage your products - {products.length} total products
                            </p>
                        </div>
                        <Link href="/admin/products/new">
                            <Button size="lg">
                                <Plus className="h-5 w-5 mr-2" />
                                Add New Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search products by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead className="w-24">Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Original</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead className="w-20">Rating</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                                        {searchQuery ? "No products found matching your search." : "No products available."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                    onError={(e) => {
                                                        // Fallback to color/initials if image fails to load
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-16 h-16 rounded ${product.color} flex items-center justify-center`}
                                                style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}
                                            >
                                                <span className="text-white font-bold text-xs opacity-70">
                                                    {product.initials}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {product.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {product.categories && product.categories.length > 0 ? (
                                                    product.categories.map((cat) => (
                                                        <span
                                                            key={cat}
                                                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-primary">
                                            {product.price}
                                        </TableCell>
                                        <TableCell className="text-gray-500 line-through text-sm">
                                            {product.originalPrice || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {product.discount ? (
                                                <span className="text-red-600 font-semibold text-sm">
                                                    {product.discount}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {product.rating ? (
                                                <div className="flex items-center text-amber-500 text-sm font-semibold">
                                                    ★ {product.rating}
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(product)}
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



                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete <strong>{productToDelete?.title}</strong>.
                                This action cannot be undone.
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
