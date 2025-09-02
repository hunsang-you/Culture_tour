"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSessionStore } from "@/app/context/store";
import type { Users } from "@/types/users";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    // 현재 유저 가져오기
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const user: Users = {
          id: data.user.id,
          email: data.user.email ?? "",
          nickname: data.user.user_metadata?.nickname,
          profile_image: data.user.user_metadata?.avatar_url,
          name: data.user.user_metadata?.name,
          full_name: data.user.user_metadata?.full_name,
          user_name: data.user.user_metadata?.user_name,
          preferred_username: data.user.user_metadata?.preferred_username,
          created_at: data.user.created_at,
        };
        setUser(user);
      } else {
        setUser(null);
      }
    };

    getUser();

    // 로그인/로그아웃 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const user: Users = {
            id: session.user.id,
            email: session.user.email ?? "",
            nickname: session.user.user_metadata?.nickname,
            profile_image: session.user.user_metadata?.avatar_url,
            name: session.user.user_metadata?.name,
            full_name: session.user.user_metadata?.full_name,
            user_name: session.user.user_metadata?.user_name,
            preferred_username: session.user.user_metadata?.preferred_username,
            created_at: session.user.created_at,
          };
          setUser(user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase, setUser]);

  return <>{children}</>;
}
