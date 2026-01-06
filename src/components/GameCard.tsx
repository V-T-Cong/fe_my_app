import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

interface GameProps {
	id: number;
	title: string;
	price: string;
	originalPrice?: string;
	discount?: string;
	rating?: number;
	category: string;
	color: string;
	initials: string;
	badge?: string; // For "NEW" or Custom badges
}

export function GameCard({ game, badgeLabel }: { game: GameProps, badgeLabel?: string }) {
	return (
		<div className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
			{/* Badge Logic: Priority to props, then internal discount */}
			{(badgeLabel || game.discount) && (
				<div className={`absolute top-3 right-3 z-10 text-white text-xs font-bold px-2 py-1 rounded ${badgeLabel ? 'bg-blue-600' : 'bg-red-500'}`}>
					{badgeLabel || game.discount}
				</div>
			)}

			<Link href={`/product/${game.id}`} className="block">
				<div className={`h-48 w-full ${game.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
					<span className="text-white font-bold opacity-50 text-xl">{game.initials}</span>
				</div>
			</Link>

			<div className="p-4 flex flex-col grow">
				<div className="flex justify-between items-center mb-2">
					<span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{game.category}</span>
					{game.rating && (
						<div className="flex items-center text-amber-400 text-xs font-bold">
							<Star className="h-3 w-3 mr-1 fill-current" />
							{game.rating}
						</div>
					)}
				</div>

				{/* Make Title Clickable */}
				<Link href={`/product/${game.id}`} className="block mb-1">
					<h3 className="font-bold text-gray-900 truncate hover:text-primary transition-colors" title={game.title}>
						{game.title}
					</h3>
				</Link>

				{/* ... Price section ... */}

				{/* Update Button to be 'Add to Cart' functionality usually, but Link for 'View Details' */}
				<div className="mt-auto pt-4 border-t">
					{badgeLabel ? (
						<Link href={`/product/${game.id}`} className="w-full">
							<Button className="w-full font-semibold" variant="outline" size="sm">
								View Details
							</Button>
						</Link>
					) : (
						<Button className="w-full font-semibold" size="sm">
							Add to Cart
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}