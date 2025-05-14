"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "@/components/chat-message";
import { LogOut } from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI fitness advisor. Ask me anything about workouts, nutrition, or bodybuilding techniques.",
    },
  ]);

  // Check authentication when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          // Not authenticated, redirect to auth page
          router.push("/auth");
        } else {
          setSession(data.session);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        if (!currentSession) router.push("/auth");
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // Save prompt and clear input
    const userPrompt = prompt;
    setPrompt("");
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.result,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  // Show loading state while checking auth
  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Fitness AI</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <span>Sign out</span>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-6 pb-20">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about workouts, nutrition, or fitness advice..."
                className="min-h-[60px] flex-1 resize-none rounded-lg border-gray-200 bg-white px-4 py-3 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-300"
              />
              <Button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="h-[60px] rounded-lg px-6"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
