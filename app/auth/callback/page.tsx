"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error.message);
          router.push("/auth"); // Redirect to auth page if there's an error
          return;
        }

        if (session) {
          // Successfully authenticated, redirect to dashboard
          router.push("/dashboard");
        } else {
          // No session, redirect back to auth page
          router.push("/auth");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth");
      }
    };

    handleAuthCallback();
  }, [router]);

  // Show loading indicator while processing
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
}
