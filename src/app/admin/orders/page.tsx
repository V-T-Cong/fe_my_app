"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { initializeOrders, updateOrderStatus, deleteOrder, type Order } from "@/lib/redux/features/ordersSlice";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";

export default function AdminOrdersPage() {
    const dispatch = useAppDispatch();
    const orders = useAppSelector((state) => state.orders.orders);

    useEffect(() => {
        dispatch(initializeOrders());
    }, [dispatch]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

    // Filter orders based on search and status
    const filteredOrders = orders.filter((order: Order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const stats = {
        total: orders.length,
        pending: orders.filter((o: Order) => o.status === "pending").length,
        processing: orders.filter((o: Order) => o.status === "processing").length,
        completed: orders.filter((o: Order) => o.status === "completed").length,
        cancelled: orders.filter((o: Order) => o.status === "cancelled").length,
        totalRevenue: orders
            .filter((o: Order) => o.status === "completed")
            .reduce((sum: number, order: Order) => sum + order.total, 0),
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
        dispatch(
            updateOrderStatus({
                orderId,
                status: newStatus as Order["status"],
            })
        );
    };

    const handleDeleteClick = (orderId: string) => {
        setOrderToDelete(orderId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (orderToDelete) {
            dispatch(deleteOrder(orderToDelete));
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "processing":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="container mx-auto p-6 lg:p-8">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Total Orders</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                        <div className="text-sm text-yellow-700">Pending</div>
                        <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-700">Processing</div>
                        <div className="text-2xl font-bold text-blue-900 mt-1">{stats.processing}</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="text-sm text-green-700">Completed</div>
                        <div className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</div>
                    </div>
                    <div className="bg-red-50 p6 rounded-lg border border-red-200">
                        <div className="text-sm text-red-700">Cancelled</div>
                        <div className="text-2xl font-bold text-red-900 mt-1">{stats.cancelled}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-700">Total Revenue</div>
                        <div className="text-2xl font-bold text-purple-900 mt-1">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search by Order ID, Customer Email, or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order: Order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() =>
                                                setSelectedOrder(selectedOrder === order.id ? null : order.id)
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customerName}
                                                </div>
                                                <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.items.length} items</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(order.total)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => handleStatusChange(order.id, value)}
                                                >
                                                    <SelectTrigger
                                                        className={`w-32 border ${getStatusColor(order.status)}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="processing">Processing</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(order.id);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Expanded Order Details */}
                    {filteredOrders.map((order: Order) =>
                        selectedOrder === order.id ? (
                            <div key={`details-${order.id}`} className="border-t border-gray-200 bg-gray-50 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="text-gray-600">Name:</span>{" "}
                                                <span className="text-gray-900">{order.customerName}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Email:</span>{" "}
                                                <span className="text-gray-900">{order.customerEmail}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="text-gray-600">Order ID:</span>{" "}
                                                <span className="text-gray-900">{order.id}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Date:</span>{" "}
                                                <span className="text-gray-900">{formatDate(order.orderDate)}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Payment Method:</span>{" "}
                                                <span className="text-gray-900">{order.paymentMethod}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-700 mb-3">Order Items</h4>
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Product
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Type
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                        Price
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                                        Qty
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                        Subtotal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${item.productType === "key"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-purple-100 text-purple-800"
                                                                    }`}
                                                            >
                                                                {item.productType === "key" ? "🔑 Key" : "👤 Account"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                            {item.price}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                                            {formatCurrency(
                                                                parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                                        Total:
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                                                        {formatCurrency(order.total)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order{" "}
                            <span className="font-semibold">{orderToDelete}</span> from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
