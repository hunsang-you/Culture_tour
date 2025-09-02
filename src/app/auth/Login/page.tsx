"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일 회원가입
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(`회원가입 실패: ${error.message}`);
    else alert("회원가입 성공! 이메일을 확인해주세요.");
  };

  // 이메일 로그인
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(`로그인 실패: ${error.message}`);
    else alert("로그인 성공!");
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(`구글 로그인 실패: ${error.message}`);
  };

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });
    if (error) alert(`카카오 로그인 실패: ${error.message}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {/* 이메일/비밀번호 입력 */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          로그인
        </button>
        <button
          onClick={handleSignup}
          className="px-4 py-2 text-white bg-green-500 rounded"
        >
          회원가입
        </button>
      </div>

      <hr className="w-1/2 my-4" />

      {/* 소셜 로그인 */}
      <button
        onClick={handleGoogleLogin}
        className="w-40 px-4 py-2 text-white bg-red-500 rounded"
      >
        Google 로그인
      </button>
      <button
        onClick={handleKakaoLogin}
        className="w-40 px-4 py-2 text-black bg-yellow-400 rounded"
      >
        Kakao 로그인
      </button>
    </div>
  );
}
