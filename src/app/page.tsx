import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";
import { FEATURED_GAMES, NEW_ARRIVALS, SOFTWARE_PRODUCTS, GIFT_CARDS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Zap, Flame, Sparkles, Monitor, Gift } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <NavBar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-primary text-primary-foreground overflow-hidden">
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
              Get instant access to thousands of Steam keys, Xbox codes, and software licenses at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base font-semibold bg-white text-black hover:bg-gray-100 border-0">
                Browse Best Sellers
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white">
                View Latest Deals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="border-y bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureItem icon={<Zap className="h-6 w-6" />} color="bg-blue-100 text-blue-600" title="Instant Delivery" desc="Get your digital code immediately via email." />
              <FeatureItem icon={<Shield className="h-6 w-6" />} color="bg-green-100 text-green-600" title="Secure Payments" desc="We use SSL encryption and trusted gateways." />
              <FeatureItem icon={<CheckCircle className="h-6 w-6" />} color="bg-purple-100 text-purple-600" title="Official Reseller" desc="100% legitimate keys from publishers." />
            </div>
          </div>
        </section>

        {/* 1. TRENDING GAMES */}
        <section className="container mx-auto px-4 py-16">
          <SectionHeader title="Trending Now" icon={<Flame className="h-6 w-6 text-orange-500 mr-2" />} link="/category/gaming" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {FEATURED_GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* 2. NEW ARRIVALS */}
        <section className="bg-white border-y py-16">
          <div className="container mx-auto px-4">
            <SectionHeader title="Fresh Arrivals" icon={<Sparkles className="h-6 w-6 text-purple-500 mr-2" />} link="/category/new" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {NEW_ARRIVALS.map((game) => (
                <GameCard key={game.id} game={game} badgeLabel="NEW" />
              ))}
            </div>
          </div>
        </section>

        {/* 3. SOFTWARE ESSENTIALS (NEW) */}
        <section className="container mx-auto px-4 py-16">
          <SectionHeader title="Software Essentials" icon={<Monitor className="h-6 w-6 text-blue-500 mr-2" />} link="/category/software" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {SOFTWARE_PRODUCTS.map((product) => (
              <GameCard key={product.id} game={product} />
            ))}
          </div>
        </section>

        {/* 4. GIFT CARDS (NEW) */}
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Custom Header for Dark Section */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight flex items-center text-white">
                <Gift className="h-6 w-6 text-pink-500 mr-2" />
                Top Gift Cards
              </h2>
              <Link href="/category/gift-cards" className="text-sm font-semibold text-gray-400 hover:text-white hover:underline">
                View all cards &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {GIFT_CARDS.map((card) => (
                <GameCard key={card.id} game={card} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Small helper component local to this file (or move to components folder if reused)
function FeatureItem({ icon, color, title, desc }: { icon: ReactNode, color: string, title: string, desc: string }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`${color} p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, link }: { title: string, icon: React.ReactNode, link: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold tracking-tight flex items-center">
        {icon}
        {title}
      </h2>
      <Link href={link} className="text-sm font-semibold text-primary hover:underline">
        View all &rarr;
      </Link>
    </div>
  );
}