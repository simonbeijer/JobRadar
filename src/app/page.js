import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col gap-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to jobRadar
          </h1>
          <p className="text-lg text-grey max-w-md">
            Track and manage your job search journey
          </p>
          <Link href="login" className="inline-block bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
