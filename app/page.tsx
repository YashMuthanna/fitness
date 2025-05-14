"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./utils/supabase/client";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status when the component mounts
    const checkAuth = async () => {
      try {
        // Important: This will detect tokens in the URL hash
        // which is essential for the implicit flow to work
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session found, redirecting to dashboard");
          router.push("/dashboard");
        } else {
          console.log("No session found, staying on homepage");
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Home auth check error:", error);
        setIsChecking(false);
      }
    };

    // Add a small delay to ensure the auth state is processed
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

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
