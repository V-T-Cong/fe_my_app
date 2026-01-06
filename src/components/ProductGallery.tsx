"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// We can define a loose interface for the product data we need
interface ProductData {
	title: string;
	color: string;
	initials: string;
	discount?: string;
}

export function ProductGallery({ product }: { product: ProductData }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const totalImages = 4; // Simulating 4 images

	const handleNext = () => {
		setActiveIndex((prev) => (prev + 1) % totalImages);
	};

	const handlePrev = () => {
		setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
	};

	return (
		<div className="w-full flex flex-col items-center lg:items-end lg:pr-8">
			{/* 1. MAIN IMAGE CAROUSEL */}
			<div className={`aspect-video max-h-80 max-w-lg w-full rounded-xl ${product.color} flex items-center justify-center shadow-lg relative overflow-hidden group mb-4 transition-colors duration-500`}>

				{/* Background Overlay */}
				<div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

				{/* Dynamic Content (Simulating different images) */}
				<span className="text-7xl font-black text-white opacity-40 select-none tracking-tighter">
					{product.initials}
					{activeIndex > 0 && <span className="text-5xl opacity-70">-{activeIndex + 1}</span>}
				</span>

				{/* Badge (Only show on first image usually, but keeping it here) */}
				{product.discount && (
					<span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-2.5 py-0.5 rounded-full shadow-md z-10">
						{product.discount} OFF
					</span>
				)}

				{/* --- NAVIGATION ARROWS --- */}
				{/* Previous Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={handlePrev}
					className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-10 w-10 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
				>
					<ChevronLeft className="h-6 w-6" />
				</Button>

				{/* Next Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={handleNext}
					className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-10 w-10 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
				>
					<ChevronRight className="h-6 w-6" />
				</Button>
			</div>

			{/* 2. THUMBNAIL LIST */}
			<div className="grid grid-cols-4 gap-3 w-full max-w-lg">
				{Array.from({ length: totalImages }).map((_, index) => (
					<div
						key={index}
						onClick={() => setActiveIndex(index)}
						className={`
              aspect-video rounded-lg cursor-pointer overflow-hidden border-2 
              transition-all ${product.color} relative
              ${activeIndex === index ? "border-primary ring-2 ring-primary/20 scale-95" : "border-transparent opacity-70 hover:opacity-100"}
            `}
					>
						<div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
						<div className="flex items-center justify-center h-full">
							<span className="text-white/50 font-bold text-xs">
								{index === 0 ? <ImageIcon className="w-5 h-5" /> : index + 1}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}