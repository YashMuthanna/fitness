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
        const { data, error } = await supabase.auth.getSession();
        console.log("data", data);

        if (error) {
          console.error("Error getting session:", error.message);
          router.push("/auth"); // Redirect to auth page if there's an error

          return;
        }

        if (data.session) {
          // Store access and refresh tokens in local storage
          const { access_token, refresh_token } = data.session;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

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
