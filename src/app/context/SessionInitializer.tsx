// app/context/SessionInitializer.tsx
"use client";

import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useSessionStore } from "./store";
import { Users } from "@/types/users";

interface SessionInitializerProps {
  session: Session | null;
  userProfile: Users | null;
}

const SessionInitializer = ({
  session,
  userProfile,
}: SessionInitializerProps) => {
  const { setUser } = useSessionStore();

  useEffect(() => {
    // 세션과 사용자 프로필 정보가 모두 존재할 때만 Zustand에 저장
    if (session && userProfile) {
      setUser(userProfile);
    } else {
      setUser(null);
    }
  }, [session, userProfile, setUser]);

  return null;
};

export default SessionInitializer;
