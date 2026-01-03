import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <NavBar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}