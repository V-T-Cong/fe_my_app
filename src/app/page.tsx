import { NavBar } from "@/components/NavBar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="container py-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to the Home Page!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your navigation bar is now active and ready for content.
        </p>
      </main>
    </div>
  );
}