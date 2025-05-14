"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../app/utils/supabase/client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.push("/auth");
    };
    checkAuth();
  }, []);

  return <>{children}</>;
}
