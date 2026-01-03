import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-300 py-12">
			<div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<h4 className="text-white font-bold text-lg mb-4">GamerKeys</h4>
					<p className="text-sm text-gray-400">Your number one source for digital games and software keys.</p>
				</div>
				<div>
					<h4 className="text-white font-bold mb-4">Shop</h4>
					<ul className="space-y-2 text-sm">
						<li><Link href="#" className="hover:text-white">New Arrivals</Link></li>
						<li><Link href="#" className="hover:text-white">Best Sellers</Link></li>
					</ul>
				</div>
				<div>
					<h4 className="text-white font-bold mb-4">Support</h4>
					<ul className="space-y-2 text-sm">
						<li><Link href="#" className="hover:text-white">Help Center</Link></li>
						<li><Link href="#" className="hover:text-white">Refund Policy</Link></li>
					</ul>
				</div>
				<div>
					<h4 className="text-white font-bold mb-4">Newsletter</h4>
					<div className="flex gap-2">
						<input type="email" placeholder="Email" className="bg-gray-800 border-none text-sm px-3 py-2 rounded w-full" />
						<Button size="sm">Sub</Button>
					</div>
				</div>
			</div>
			<div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
				© 2024 GamerKeys. All rights reserved.
			</div>
		</footer>
	);
}