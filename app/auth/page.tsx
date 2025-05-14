"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "../utils/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    console.log("data", data);
    console.log("URL", data.url);
    if (error) {
      console.error("Error signing in:", error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mx-auto w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to Fitness AI
          </h1>
          <p className="text-sm text-gray-500">
            Access personalized fitness advice and workout plans
          </p>
        </div>
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          variant="outline"
          className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white py-6 text-black hover:bg-gray-50"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900"></div>
          ) : (
            <span>Sign in with Google</span>
          )}
        </Button>
      </div>
    </div>
  );
}
