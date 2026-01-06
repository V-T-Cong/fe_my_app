import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/productUtils";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/ProductGallery";
import {
	ShoppingCart,
	Heart,
	Share2,
	ShieldCheck,
	Zap,
	Globe,
	MonitorPlay,
	CreditCard
} from "lucide-react";
import Link from "next/link";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
	const { id } = await params;
	const product = getProductById(id);

	if (!product) {
		notFound();
	}

	const relatedProducts = getRelatedProducts(product.category, product.id);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Breadcrumbs */}
			<nav className="text-sm text-gray-500 mb-8">
				<Link href="/" className="hover:text-primary">Home</Link>
				<span className="mx-2">/</span>
				<Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">{product.category}</Link>
				<span className="mx-2">/</span>
				<span className="text-gray-900 font-medium">{product.title}</span>
			</nav>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-start">

				{/* LEFT COLUMN: Interactive Gallery */}
				<ProductGallery product={product} />

				{/* RIGHT COLUMN: Product Details */}
				<div className="lg:pl-4">
					<div className="flex items-center gap-2 mb-3">
						<span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
							{product.category}
						</span>
						<div className="flex items-center text-amber-500 text-sm font-bold">
							<span className="mr-1">★</span> {product.rating || "4.9"} <span className="text-gray-400 font-normal ml-1">(1.2k)</span>
						</div>
					</div>

					<h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
						{product.title}
					</h1>

					<div className="flex items-baseline gap-3 mb-6">
						<span className="text-3xl font-black text-primary">{product.price}</span>
						{product.originalPrice && (
							<span className="text-lg text-gray-400 line-through font-medium">
								{product.originalPrice}
							</span>
						)}
					</div>

					<div className="mb-8 prose prose-sm text-gray-600 leading-relaxed">
						<p className="mb-4">
							Get instant access to <strong>{product.title}</strong>.
							This official digital key is delivered immediately to your email after secure payment.
						</p>
						<ul className="list-disc pl-4 space-y-1">
							<li>Instant Digital Delivery</li>
							<li>Official & Legitimate Key</li>
							<li>Global Region Activation</li>
						</ul>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-3 mb-8 border-b pb-8">

						{/* 1. BUY NOW BUTTON (New Addition) */}
						<Button size="lg" className="w-full h-12 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all hover:scale-[1.01]">
							<CreditCard className="w-5 h-5 mr-2" />
							Buy Now
						</Button>

						{/* 2. ADD TO CART ROW */}
						<div className="flex flex-col sm:flex-row gap-3">
							<Button size="lg" variant="secondary" className="flex-1 h-11 text-base gap-2 font-bold border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-900">
								<ShoppingCart className="w-4 h-4" />
								Add to Cart
							</Button>

							<div className="flex gap-2">
								<Button variant="outline" size="lg" className="h-11 w-11 p-0 hover:text-red-500 hover:bg-red-50 hover:border-red-200">
									<Heart className="w-5 h-5" />
								</Button>
								<Button variant="outline" size="lg" className="h-11 w-11 p-0 hover:bg-gray-50">
									<Share2 className="w-5 h-5" />
								</Button>
							</div>
						</div>
					</div>

					{/* Features / Assurance */}
					<div className="grid grid-cols-2 gap-3 text-xs font-semibold text-gray-700">
						<div className="flex items-center gap-2 p-2 rounded bg-gray-50 border">
							<Zap className="w-4 h-4 text-yellow-600" />
							<span>Instant Delivery</span>
						</div>
						<div className="flex items-center gap-2 p-2 rounded bg-gray-50 border">
							<ShieldCheck className="w-4 h-4 text-green-600" />
							<span>Secure Payment</span>
						</div>
						<div className="flex items-center gap-2 p-2 rounded bg-gray-50 border">
							<Globe className="w-4 h-4 text-blue-600" />
							<span>Global Region</span>
						</div>
						<div className="flex items-center gap-2 p-2 rounded bg-gray-50 border">
							<MonitorPlay className="w-4 h-4 text-purple-600" />
							<span>Lifetime Access</span>
						</div>
					</div>

				</div>
			</div>

			{/* 4. RELATED PRODUCTS */}
			{relatedProducts.length > 0 && (
				<section className="border-t pt-12">
					<h2 className="text-xl font-bold mb-6">Similar products</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{relatedProducts.map((p) => (
							<GameCard key={p.id} game={p} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}