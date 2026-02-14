"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to products page as the default admin page
        router.push("/admin/products");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-700">
                    Redirecting to Admin Dashboard...
                </h1>
            </div>
        </div>
    );
}
