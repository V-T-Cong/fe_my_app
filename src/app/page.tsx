import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Zap, Star, Flame, Monitor, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <NavBar />

      <main className="flex-1">
        {/* ==================== 1. HERO SECTION ==================== */}
        <section className="relative bg-primary text-primary-foreground overflow-hidden">
          {/* Background Pattern (Optional subtle effect) */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              New Season Sale is Live!
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 text-white">
              Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Gaming Library</span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Get instant access to thousands of Steam keys, Xbox codes, and software licenses at unbeatable prices. Secure, fast, and reliable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base font-semibold bg-white text-black hover:bg-gray-100 border-0">
                Browse Best Sellers
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white">
                View Latest Deals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* ==================== 2. VALUE PROPS (Trust Signals) ==================== */}
        <section className="border-y bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Instant Delivery</h3>
                  <p className="text-sm text-gray-500 mt-1">Get your digital code immediately via email after purchase. No waiting.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Secure Payments</h3>
                  <p className="text-sm text-gray-500 mt-1">We use SSL encryption and trusted payment gateways for your safety.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Official Reseller</h3>
                  <p className="text-sm text-gray-500 mt-1">100% legitimate keys sourced directly from publishers and distributors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. NEW ARRIVALS SECTION (NEW) ==================== */}
        <section className="bg-white border-y py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight flex items-center">
                <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                Fresh Arrivals
              </h2>
              <Link href="/category/new" className="text-sm font-semibold text-primary hover:underline">
                View all new &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {NEW_ARRIVALS.map((game) => (
                <div key={game.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* For new arrivals, maybe a "NEW" badge instead of discount */}
                  <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                  <div className={`h-48 w-full ${game.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                    <span className="text-white font-bold opacity-50 text-xl">{game.initials}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{game.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 truncate mb-1" title={game.title}>
                      {game.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="font-bold text-lg text-primary">{game.price}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full font-semibold" variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== 3. FEATURED PRODUCTS ==================== */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight flex items-center">
              <Flame className="h-6 w-6 text-orange-500 mr-2" />
              Trending Now
            </h2>
            <Link href="/category/gaming" className="text-sm font-semibold text-primary hover:underline">
              View all games &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {/* Map through mock data */}
            {FEATURED_GAMES.map((game) => (
              <div key={game.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {game.discount}
                </div>

                {/* Image Placeholder */}
                <div className={`h-48 w-full ${game.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                  <span className="text-white font-bold opacity-50 text-xl">{game.initials}</span>
                </div>

                <div className="p-4">
                  {/* Category & Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{game.category}</span>
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {game.rating}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 truncate mb-1" title={game.title}>
                    {game.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="font-bold text-lg text-primary">{game.price}</span>
                    <span className="text-sm text-gray-400 line-through">{game.originalPrice}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full font-semibold" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {FEATURED_GAMES.map((game) => (
              <div key={game.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {game.discount}
                </div>

                {/* Image Placeholder */}
                <div className={`h-48 w-full ${game.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                  <span className="text-white font-bold opacity-50 text-xl">{game.initials}</span>
                </div>

                <div className="p-4">
                  {/* Category & Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{game.category}</span>
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {game.rating}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 truncate mb-1" title={game.title}>
                    {game.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="font-bold text-lg text-primary">{game.price}</span>
                    <span className="text-sm text-gray-400 line-through">{game.originalPrice}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full font-semibold" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ==================== 4. SOFTWARE SECTION ==================== */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Monitor className="h-6 w-6 text-blue-500 mr-2" />
            Essential Software
          </h2>
          <Link href="/category/software" className="text-sm font-semibold text-primary hover:underline">
            View all software &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {FEATURED_SOFTWARE.map((item) => (
            <div key={item.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                {item.discount}
              </div>

              {/* Image Placeholder */}
              <div className={`h-48 w-full ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                <span className="text-white font-bold opacity-75 text-xl tracking-wider">{item.initials}</span>
              </div>

              <div className="p-4">
                {/* Category & Rating */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {item.rating}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 truncate mb-1" title={item.title}>
                  {item.title}
                </h3>

                {/* Price */}
                <div className="flex items-center space-x-2 mt-3">
                  <span className="font-bold text-lg text-primary">{item.price}</span>
                  <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full font-semibold" size="sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {FEATURED_SOFTWARE.map((item) => (
            <div key={item.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                {item.discount}
              </div>

              {/* Image Placeholder */}
              <div className={`h-48 w-full ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                <span className="text-white font-bold opacity-75 text-xl tracking-wider">{item.initials}</span>
              </div>

              <div className="p-4">
                {/* Category & Rating */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {item.rating}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 truncate mb-1" title={item.title}>
                  {item.title}
                </h3>

                {/* Price */}
                <div className="flex items-center space-x-2 mt-3">
                  <span className="font-bold text-lg text-primary">{item.price}</span>
                  <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full font-semibold" size="sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SIMPLE FOOTER ==================== */}
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
              <li><Link href="#" className="hover:text-white">Discounted</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
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
    </div>
  );
}

// Mock Data placed at the bottom or outside the component
const FEATURED_GAMES = [
  {
    id: 1,
    title: "Elden Ring: Shadow of the Erdtree",
    price: "$39.99",
    originalPrice: "$49.99",
    discount: "-20%",
    rating: 4.9,
    category: "RPG",
    color: "bg-gradient-to-br from-yellow-600 to-red-800",
    initials: "ER"
  },
  {
    id: 2,
    title: "Cyberpunk 2077: Ultimate Edition",
    price: "$29.99",
    originalPrice: "$59.99",
    discount: "-50%",
    rating: 4.7,
    category: "Action",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    initials: "CP77"
  },
  {
    id: 3,
    title: "Minecraft: Java & Bedrock Edition",
    price: "$19.99",
    originalPrice: "$29.99",
    discount: "-33%",
    rating: 4.8,
    category: "Sandbox",
    color: "bg-gradient-to-br from-green-500 to-green-700",
    initials: "MC"
  },
  {
    id: 4,
    title: "God of War Ragnarök",
    price: "$49.99",
    originalPrice: "$69.99",
    discount: "-28%",
    rating: 4.9,
    category: "Adventure",
    color: "bg-gradient-to-br from-blue-700 to-slate-800",
    initials: "GOW"
  },
];

const FEATURED_SOFTWARE = [
  {
    id: 101,
    title: "Windows 11 Pro Retail Key",
    price: "$14.99",
    originalPrice: "$199.00",
    discount: "-92%",
    rating: 4.8,
    category: "OS",
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    initials: "WIN 11"
  },
  {
    id: 102,
    title: "Microsoft Office 2021 Pro Plus",
    price: "$24.99",
    originalPrice: "$439.99",
    discount: "-94%",
    rating: 4.9,
    category: "Productivity",
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    initials: "OFFICE"
  },
  {
    id: 103,
    title: "NordVPN 1 Year Subscription",
    price: "$59.99",
    originalPrice: "$99.99",
    discount: "-40%",
    rating: 4.7,
    category: "Security",
    color: "bg-gradient-to-br from-blue-600 to-cyan-500",
    initials: "NORD"
  },
  {
    id: 104,
    title: "Adobe Creative Cloud (3 Months)",
    price: "$89.99",
    originalPrice: "$179.99",
    discount: "-50%",
    rating: 4.6,
    category: "Creative",
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    initials: "ADOBE"
  },
];


const NEW_ARRIVALS = [
  {
    id: 101,
    title: "Call of Duty: Black Ops 6",
    price: "$69.99",
    category: "Shooter",
    color: "bg-gradient-to-br from-gray-700 to-gray-900",
    initials: "BO6"
  },
  {
    id: 102,
    title: "EA Sports FC 25",
    price: "$59.99",
    category: "Sports",
    color: "bg-gradient-to-br from-green-400 to-blue-500",
    initials: "FC25"
  },
  {
    id: 103,
    title: "Final Fantasy VII Rebirth",
    price: "$69.99",
    category: "RPG",
    color: "bg-gradient-to-br from-teal-400 to-cyan-600",
    initials: "FF7"
  },
  {
    id: 104,
    title: "Star Wars Outlaws",
    price: "$69.99",
    category: "Adventure",
    color: "bg-gradient-to-br from-orange-400 to-red-500",
    initials: "SW"
  },
];