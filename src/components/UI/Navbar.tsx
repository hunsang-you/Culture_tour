"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <div className="flex items-center justify-between w-full h-12 min-w-full gap-4 px-8 font-bold bg-white border-2 border-black">
        <div className="flex gap-4">
          <div className="px-2 bg-yellow-300">
            <Link href="/">Home</Link>
          </div>
          <div className="px-2 bg-yellow-300">
            <Link href="/search">검색</Link>
          </div>
          <div className="px-2 bg-yellow-300">
            <Link href="/community">게시판</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-2 bg-yellow-300">
            <Link href="/auth/Login">Login</Link>
          </div>
          <div className="px-2 bg-yellow-300">
            <Link href="/auth/Signup">회원가입</Link>
          </div>
        </div>
      </div>
    </>
  );
}
