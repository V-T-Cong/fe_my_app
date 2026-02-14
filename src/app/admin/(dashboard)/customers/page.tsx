"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
    initializeCustomers,
    updateCustomerStatus,
    deleteCustomer,
    type Customer,
} from "@/lib/redux/features/customersSlice";
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

export default function AdminCustomersPage() {
    const dispatch = useAppDispatch();
    const customers = useAppSelector((state) => state.customers.customers);

    useEffect(() => {
        dispatch(initializeCustomers());
    }, [dispatch]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

    // Filter customers based on search and status
    const filteredCustomers = customers.filter((customer: Customer) => {
        const matchesSearch =
            customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || customer.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const stats = {
        total: customers.length,
        active: customers.filter((c: Customer) => c.status === "active").length,
        inactive: customers.filter((c: Customer) => c.status === "inactive").length,
        suspended: customers.filter((c: Customer) => c.status === "suspended").length,
        totalRevenue: customers.reduce(
            (sum: number, customer: Customer) => sum + customer.totalSpent,
            0
        ),
        avgOrderValue:
            customers.length > 0
                ? customers.reduce(
                    (sum: number, customer: Customer) => sum + customer.totalSpent,
                    0
                ) / customers.filter((c: Customer) => c.totalOrders > 0).length
                : 0,
    };

    const handleStatusChange = (customerId: string, newStatus: string) => {
        dispatch(
            updateCustomerStatus({
                customerId,
                status: newStatus as Customer["status"],
            })
        );
    };

    const handleDeleteClick = (customerId: string) => {
        setCustomerToDelete(customerId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (customerToDelete) {
            dispatch(deleteCustomer(customerToDelete));
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-300";
            case "inactive":
                return "bg-gray-100 text-gray-800 border-gray-300";
            case "suspended":
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
        });
    };

    return (
        <div className="container mx-auto p-6 lg:p-8">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                    <p className="text-gray-600 mt-2">Manage and track all customer accounts</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Total Customers</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="text-sm text-green-700">Active</div>
                        <div className="text-2xl font-bold text-green-900 mt-1">{stats.active}</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-700">Inactive</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.inactive}</div>
                    </div>
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <div className="text-sm text-red-700">Suspended</div>
                        <div className="text-2xl font-bold text-red-900 mt-1">{stats.suspended}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-700">Total Revenue</div>
                        <div className="text-2xl font-bold text-purple-900 mt-1">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-700">Avg Order Value</div>
                        <div className="text-2xl font-bold text-blue-900 mt-1">
                            {formatCurrency(stats.avgOrderValue)}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search by Customer ID, Email, or Name..."
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Spent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered
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
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                            No customers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer: Customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() =>
                                                setSelectedCustomer(
                                                    selectedCustomer === customer.id ? null : customer.id
                                                )
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{customer.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {customer.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(customer.totalSpent)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(customer.registeredDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Select
                                                    value={customer.status}
                                                    onValueChange={(value) => handleStatusChange(customer.id, value)}
                                                >
                                                    <SelectTrigger
                                                        className={`w-32 border ${getStatusColor(customer.status)}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(customer.id);
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

                    {/* Expanded Customer Details */}
                    {filteredCustomers.map((customer: Customer) =>
                        selectedCustomer === customer.id ? (
                            <div
                                key={`details-${customer.id}`}
                                className="border-t border-gray-200 bg-gray-50 p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Customer Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Personal Information
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="text-gray-600">Customer ID:</span>{" "}
                                                <span className="text-gray-900">{customer.id}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Name:</span>{" "}
                                                <span className="text-gray-900">{customer.name}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Email:</span>{" "}
                                                <span className="text-gray-900">{customer.email}</span>
                                            </p>
                                            {customer.phone && (
                                                <p>
                                                    <span className="text-gray-600">Phone:</span>{" "}
                                                    <span className="text-gray-900">{customer.phone}</span>
                                                </p>
                                            )}
                                            {customer.address && (
                                                <p>
                                                    <span className="text-gray-600">Address:</span>{" "}
                                                    <span className="text-gray-900">{customer.address}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Purchase History
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="text-gray-600">Total Orders:</span>{" "}
                                                <span className="text-gray-900 font-semibold">
                                                    {customer.totalOrders}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Total Spent:</span>{" "}
                                                <span className="text-gray-900 font-semibold">
                                                    {formatCurrency(customer.totalSpent)}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Average Order:</span>{" "}
                                                <span className="text-gray-900">
                                                    {customer.totalOrders > 0
                                                        ? formatCurrency(customer.totalSpent / customer.totalOrders)
                                                        : "$0.00"}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Member Since:</span>{" "}
                                                <span className="text-gray-900">
                                                    {formatDate(customer.registeredDate)}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Account Status:</span>{" "}
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                                                        customer.status
                                                    )}`}
                                                >
                                                    {customer.status.charAt(0).toUpperCase() +
                                                        customer.status.slice(1)}
                                                </span>
                                            </p>
                                        </div>
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
                            This action cannot be undone. This will permanently delete the customer{" "}
                            <span className="font-semibold">{customerToDelete}</span> and all associated
                            data from the system.
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
