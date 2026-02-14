"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
    Product,
    ProductKey,
    ProductAccount,
    addProductKey,
    updateProductKey,
    deleteProductKey,
    toggleKeySoldStatus,
    addProductAccount,
    updateProductAccount,
    deleteProductAccount,
    toggleAccountSoldStatus,
} from "@/lib/redux/features/productsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Key,
    CheckCircle2,
    XCircle,
    Package,
    Plus,
    Pencil,
    Trash2,
    ToggleLeft,
    ToggleRight,
    User2,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products.items);
    const [product, setProduct] = useState<Product | null>(null);

    // Tab state
    const [activeTab, setActiveTab] = useState<"keys" | "accounts">("keys");

    // Key dialog states
    const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<ProductKey | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [keyToDelete, setKeyToDelete] = useState<ProductKey | null>(null);
    const [soldDialogOpen, setSoldDialogOpen] = useState(false);
    const [keyToToggle, setKeyToToggle] = useState<ProductKey | null>(null);

    // Account dialog states
    const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<ProductAccount | null>(null);
    const [accountDeleteDialogOpen, setAccountDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<ProductAccount | null>(null);
    const [accountSoldDialogOpen, setAccountSoldDialogOpen] = useState(false);
    const [accountToToggle, setAccountToToggle] = useState<ProductAccount | null>(null);

    // Form states for keys
    const [keyValue, setKeyValue] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");

    // Form states for accounts
    const [accountEmail, setAccountEmail] = useState("");
    const [accountPassword, setAccountPassword] = useState("");
    const [accountCustomerEmail, setAccountCustomerEmail] = useState("");

    useEffect(() => {
        const productId = parseInt(params.id as string);
        const foundProduct = products.find((p) => p.id === productId);
        setProduct(foundProduct || null);
    }, [params.id, products]);

    const resetForm = () => {
        setKeyValue("");
        setCustomerEmail("");
        setEditingKey(null);
    };

    const resetAccountForm = () => {
        setAccountEmail("");
        setAccountPassword("");
        setAccountCustomerEmail("");
        setEditingAccount(null);
    };

    const handleAddKey = () => {
        resetForm();
        setIsKeyDialogOpen(true);
    };

    const handleEditKey = (key: ProductKey) => {
        setEditingKey(key);
        setKeyValue(key.key);
        setCustomerEmail(key.customerEmail || "");
        setIsKeyDialogOpen(true);
    };

    const handleSaveKey = () => {
        if (!product || !keyValue.trim()) return;

        if (editingKey) {
            // Update existing key
            const updatedKey: ProductKey = {
                ...editingKey,
                key: keyValue.trim(),
                customerEmail: editingKey.sold ? customerEmail.trim() : undefined,
            };
            dispatch(
                updateProductKey({
                    productId: product.id,
                    keyId: editingKey.id,
                    updatedKey,
                })
            );
        } else {
            // Add new key
            const newKey: ProductKey = {
                id: `key-${Date.now()}`,
                key: keyValue.trim(),
                sold: false,
            };
            dispatch(addProductKey({ productId: product.id, key: newKey }));
        }

        setIsKeyDialogOpen(false);
        resetForm();
    };

    const handleDeleteClick = (key: ProductKey) => {
        setKeyToDelete(key);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!product || !keyToDelete) return;

        dispatch(
            deleteProductKey({
                productId: product.id,
                keyId: keyToDelete.id,
            })
        );

        setDeleteDialogOpen(false);
        setKeyToDelete(null);
    };

    const handleToggleSoldClick = (key: ProductKey) => {
        if (!product) return;

        if (!key.sold) {
            // Marking as sold - show dialog for customer email
            setKeyToToggle(key);
            setCustomerEmail("");
            setSoldDialogOpen(true);
        } else {
            // Marking as available - no dialog needed
            dispatch(
                toggleKeySoldStatus({
                    productId: product.id,
                    keyId: key.id,
                    sold: false,
                })
            );
        }
    };

    const handleConfirmSold = () => {
        if (!product || !keyToToggle) return;

        dispatch(
            toggleKeySoldStatus({
                productId: product.id,
                keyId: keyToToggle.id,
                sold: true,
                customerEmail: customerEmail.trim() || undefined,
            })
        );

        setSoldDialogOpen(false);
        setKeyToToggle(null);
        setCustomerEmail("");
    };

    // Account handlers
    const handleAddAccount = () => {
        resetAccountForm();
        setIsAccountDialogOpen(true);
    };

    const handleEditAccount = (account: ProductAccount) => {
        setEditingAccount(account);
        setAccountEmail(account.email);
        setAccountPassword(account.password);
        setAccountCustomerEmail(account.customerEmail || "");
        setIsAccountDialogOpen(true);
    };

    const handleSaveAccount = () => {
        if (!product || !accountEmail.trim() || !accountPassword.trim()) return;

        if (editingAccount) {
            // Update existing account
            const updatedAccount: ProductAccount = {
                ...editingAccount,
                email: accountEmail.trim(),
                password: accountPassword.trim(),
                customerEmail: editingAccount.sold ? accountCustomerEmail.trim() : undefined,
            };
            dispatch(
                updateProductAccount({
                    productId: product.id,
                    accountId: editingAccount.id,
                    updatedAccount,
                })
            );
        } else {
            // Add new account
            const newAccount: ProductAccount = {
                id: `acc-${Date.now()}`,
                email: accountEmail.trim(),
                password: accountPassword.trim(),
                sold: false,
            };
            dispatch(addProductAccount({ productId: product.id, account: newAccount }));
        }

        setIsAccountDialogOpen(false);
        resetAccountForm();
    };

    const handleDeleteAccountClick = (account: ProductAccount) => {
        setAccountToDelete(account);
        setAccountDeleteDialogOpen(true);
    };

    const handleConfirmAccountDelete = () => {
        if (!product || !accountToDelete) return;

        dispatch(
            deleteProductAccount({
                productId: product.id,
                accountId: accountToDelete.id,
            })
        );

        setAccountDeleteDialogOpen(false);
        setAccountToDelete(null);
    };

    const handleToggleAccountSoldClick = (account: ProductAccount) => {
        if (!product) return;

        if (!account.sold) {
            // Marking as sold - show dialog for customer email
            setAccountToToggle(account);
            setAccountCustomerEmail("");
            setAccountSoldDialogOpen(true);
        } else {
            // Marking as available - no dialog needed
            dispatch(
                toggleAccountSoldStatus({
                    productId: product.id,
                    accountId: account.id,
                    sold: false,
                })
            );
        }
    };

    const handleConfirmAccountSold = () => {
        if (!product || !accountToToggle) return;

        dispatch(
            toggleAccountSoldStatus({
                productId: product.id,
                accountId: accountToToggle.id,
                sold: true,
                customerEmail: accountCustomerEmail.trim() || undefined,
            })
        );

        setAccountSoldDialogOpen(false);
        setAccountToToggle(null);
        setAccountCustomerEmail("");
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        Product Not Found
                    </h2>
                    <p className="text-gray-500 mb-6">
                        The product you're looking for doesn't exist.
                    </p>
                    <Link href="/admin/products">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const keys = product.keys || [];
    const totalKeys = keys.length;
    const soldKeys = keys.filter((k) => k.sold).length;
    const availableKeys = totalKeys - soldKeys;

    const accounts = product.accounts || [];
    const totalAccounts = accounts.length;
    const soldAccounts = accounts.filter((a) => a.sold).length;
    const availableAccounts = totalAccounts - soldAccounts;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/products">
                        <Button variant="outline" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start gap-6">
                            {/* Product Preview */}
                            <div className="flex-shrink-0">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-32 h-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            // Fallback to color/initials if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-32 h-32 rounded-lg ${product.color} flex items-center justify-center`}
                                    style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}
                                >
                                    <span className="text-white font-bold text-3xl opacity-70">
                                        {product.initials}
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {product.title}
                                </h1>
                                <div className="flex items-center gap-4 mb-4 flex-wrap">
                                    {product.category ? (
                                        <span
                                            className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                                        >
                                            {product.category}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">No category</span>
                                    )}
                                    {product.rating && (
                                        <div className="flex items-center text-amber-500 text-lg font-semibold">
                                            ★ {product.rating}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Price</p>
                                        <p className="text-2xl font-bold text-primary">
                                            {product.price}
                                        </p>
                                    </div>
                                    {product.originalPrice && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Original Price
                                            </p>
                                            <p className="text-xl text-gray-500 line-through">
                                                {product.originalPrice}
                                            </p>
                                        </div>
                                    )}
                                    {product.discount && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Discount</p>
                                            <p className="text-xl font-semibold text-red-600">
                                                {product.discount}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    {product.images && product.images.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} - Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                                Primary
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-2">
                            {activeTab === "keys" ? (
                                <Key className="h-5 w-5 text-blue-600" />
                            ) : (
                                <User2 className="h-5 w-5 text-blue-600" />
                            )}
                            <h3 className="text-sm font-medium text-gray-500">
                                Total {activeTab === "keys" ? "Keys" : "Accounts"}
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {activeTab === "keys" ? totalKeys : totalAccounts}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <h3 className="text-sm font-medium text-gray-500">
                                Sold {activeTab === "keys" ? "Keys" : "Accounts"}
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            {activeTab === "keys" ? soldKeys : soldAccounts}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <XCircle className="h-5 w-5 text-orange-600" />
                            <h3 className="text-sm font-medium text-gray-500">
                                Available {activeTab === "keys" ? "Keys" : "Accounts"}
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">
                            {activeTab === "keys" ? availableKeys : availableAccounts}
                        </p>
                    </div>
                </div>

                {/* Tabbed Interface for Keys and Accounts */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "keys" | "accounts")}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="keys" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Product Keys
                        </TabsTrigger>
                        <TabsTrigger value="accounts" className="flex items-center gap-2">
                            <User2 className="h-4 w-4" />
                            Accounts
                        </TabsTrigger>
                    </TabsList>

                    {/* Keys Tab */}
                    <TabsContent value="keys">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Product Keys</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Manage and track product keys for this item
                                    </p>
                                </div>
                                <Button onClick={handleAddKey}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Key
                                </Button>
                            </div>

                            {totalKeys === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <Key className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No product keys available</p>
                                    <p className="text-sm text-gray-400 mt-1 mb-4">
                                        Add product keys to start tracking inventory
                                    </p>
                                    <Button onClick={handleAddKey} variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Key
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-24">Key ID</TableHead>
                                            <TableHead>Product Key / License</TableHead>
                                            <TableHead className="w-32">Status</TableHead>
                                            <TableHead>Sold Date</TableHead>
                                            <TableHead>Customer Email</TableHead>
                                            <TableHead className="w-48 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {keys.map((key) => (
                                            <TableRow key={key.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {key.id}
                                                </TableCell>
                                                <TableCell className="font-mono font-semibold">
                                                    {key.key}
                                                </TableCell>
                                                <TableCell>
                                                    {key.sold ? (
                                                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Sold
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                            <XCircle className="h-3 w-3" />
                                                            Available
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {formatDate(key.soldAt)}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {key.customerEmail || "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleSoldClick(key)}
                                                            title={
                                                                key.sold
                                                                    ? "Mark as Available"
                                                                    : "Mark as Sold"
                                                            }
                                                        >
                                                            {key.sold ? (
                                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditKey(key)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(key)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </TabsContent>

                    {/* Accounts Tab */}
                    <TabsContent value="accounts">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Product Accounts</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Manage and track product accounts for this item
                                    </p>
                                </div>
                                <Button onClick={handleAddAccount}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Account
                                </Button>
                            </div>

                            {totalAccounts === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <User2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No product accounts available</p>
                                    <p className="text-sm text-gray-400 mt-1 mb-4">
                                        Add product accounts to start tracking inventory
                                    </p>
                                    <Button onClick={handleAddAccount} variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Account
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-24">Account ID</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Password</TableHead>
                                            <TableHead className="w-32">Status</TableHead>
                                            <TableHead>Sold Date</TableHead>
                                            <TableHead>Customer Email</TableHead>
                                            <TableHead className="w-48 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accounts.map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {account.id}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {account.email}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {account.password}
                                                </TableCell>
                                                <TableCell>
                                                    {account.sold ? (
                                                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Sold
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                            <XCircle className="h-3 w-3" />
                                                            Available
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {formatDate(account.soldAt)}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {account.customerEmail || "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleAccountSoldClick(account)}
                                                            title={
                                                                account.sold
                                                                    ? "Mark as Available"
                                                                    : "Mark as Sold"
                                                            }
                                                        >
                                                            {account.sold ? (
                                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditAccount(account)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteAccountClick(account)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Add/Edit Key Dialog */}
                <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingKey ? "Edit Product Key" : "Add New Product Key"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingKey
                                    ? "Update the product key information below."
                                    : "Enter the product key/license to add to inventory."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Product Key / License</Label>
                                <Input
                                    id="key"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    value={keyValue}
                                    onChange={(e) => setKeyValue(e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                            {editingKey?.sold && (
                                <div className="space-y-2">
                                    <Label htmlFor="email">Customer Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="customer@example.com"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsKeyDialogOpen(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSaveKey} disabled={!keyValue.trim()}>
                                {editingKey ? "Update" : "Add"} Key
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Mark as Sold Dialog */}
                <Dialog open={soldDialogOpen} onOpenChange={setSoldDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Mark Key as Sold</DialogTitle>
                            <DialogDescription>
                                Enter the customer's email address (optional) to track this sale.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-email">Customer Email</Label>
                                <Input
                                    id="customer-email"
                                    type="email"
                                    placeholder="customer@example.com"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSoldDialogOpen(false);
                                    setKeyToToggle(null);
                                    setCustomerEmail("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmSold}>Mark as Sold</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the product key{" "}
                                <strong className="font-mono">{keyToDelete?.key}</strong>. This
                                action cannot be undone.
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

                {/* Add/Edit Account Dialog */}
                <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingAccount ? "Edit Account" : "Add New Account"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingAccount
                                    ? "Update the account information below."
                                    : "Enter the account credentials to add to inventory."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="account-email">Email</Label>
                                <Input
                                    id="account-email"
                                    type="email"
                                    placeholder="account@example.com"
                                    value={accountEmail}
                                    onChange={(e) => setAccountEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account-password">Password</Label>
                                <Input
                                    id="account-password"
                                    type="text"
                                    placeholder="Enter password"
                                    value={accountPassword}
                                    onChange={(e) => setAccountPassword(e.target.value)}
                                />
                            </div>
                            {editingAccount?.sold && (
                                <div className="space-y-2">
                                    <Label htmlFor="account-customer-email">Customer Email</Label>
                                    <Input
                                        id="account-customer-email"
                                        type="email"
                                        placeholder="customer@example.com"
                                        value={accountCustomerEmail}
                                        onChange={(e) => setAccountCustomerEmail(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAccountDialogOpen(false);
                                    resetAccountForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveAccount}
                                disabled={!accountEmail.trim() || !accountPassword.trim()}
                            >
                                {editingAccount ? "Update" : "Add"} Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Mark Account as Sold Dialog */}
                <Dialog open={accountSoldDialogOpen} onOpenChange={setAccountSoldDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Mark Account as Sold</DialogTitle>
                            <DialogDescription>
                                Enter the customer's email address (optional) to track this sale.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="account-sold-customer-email">Customer Email</Label>
                                <Input
                                    id="account-sold-customer-email"
                                    type="email"
                                    placeholder="customer@example.com"
                                    value={accountCustomerEmail}
                                    onChange={(e) => setAccountCustomerEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setAccountSoldDialogOpen(false);
                                    setAccountToToggle(null);
                                    setAccountCustomerEmail("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmAccountSold}>Mark as Sold</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Account Confirmation Dialog */}
                <AlertDialog open={accountDeleteDialogOpen} onOpenChange={setAccountDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the account{" "}
                                <strong>{accountToDelete?.email}</strong>. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmAccountDelete}
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
