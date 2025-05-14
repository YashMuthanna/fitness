import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-5xl">
            Fitness AI Advisor
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Your personal AI-powered bodybuilding and fitness assistant
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Get personalized workout plans, nutrition advice, and fitness tips
              tailored to your goals
            </p>
          </div>
          <Button asChild className="w-full" size="lg">
            <Link href="/auth">Get Started</Link>
          </Button>
          <Button asChild className="w-full" size="lg">
            <Link href="/factory">Factory</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
