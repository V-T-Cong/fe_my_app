import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/productUtils";
import { GameCard } from "@/components/GameCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductActions } from "@/components/ProductActions";
import { ProductReviews } from "@/components/ProductReviews";
import {
	ShieldCheck,
	Zap,
	Globe,
	MonitorPlay,
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

	const relatedProducts = getRelatedProducts(product.category || "General", product.id);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Breadcrumbs */}
			<nav className="text-sm text-gray-500 mb-8">
				<Link href="/" className="hover:text-primary">Home</Link>
				<span className="mx-2">/</span>
				{product.category && (
					<>
						<Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">{product.category}</Link>
						<span className="mx-2">/</span>
					</>
				)}
				<span className="text-gray-900 font-medium">{product.title}</span>
			</nav>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-start">

				{/* LEFT COLUMN: Interactive Gallery */}
				<ProductGallery product={product} />

				{/* RIGHT COLUMN: Product Details */}
				<div className="lg:pl-4">
					<div className="flex items-center gap-2 mb-3">
						<span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
							{product.category || "General"}
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
					<ProductActions product={product} />

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

			{/* Customer Reviews Section */}
			<ProductReviews productId={product.id} />

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