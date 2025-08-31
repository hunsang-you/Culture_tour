"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 데스크탑 및 태블릿용 내비게이션 */}
      <div className="hidden w-full h-12 px-4 font-bold bg-orange-300 border-2 border-black min-w-min sm:flex sm:justify-between sm:items-center">
        <div className="flex gap-4">
          <div className="flex-shrink-0 px-2 bg-yellow-300 whitespace-nowrap">
            <Link href="/">Home</Link>
          </div>
          <div className="flex-shrink-0 px-2 bg-yellow-300 whitespace-nowrap">
            <Link href="/search">검색</Link>
          </div>
          <div className="flex-shrink-0 px-2 bg-yellow-300 whitespace-nowrap">
            <Link href="/community">게시판</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-shrink-0 px-2 bg-yellow-300 whitespace-nowrap">
            <Link href="/auth/Login">Login</Link>
          </div>
          <div className="flex-shrink-0 px-2 bg-yellow-300 whitespace-nowrap">
            <Link href="/auth/Signup">회원가입</Link>
          </div>
        </div>
      </div>

      {/* 모바일 뷰용 햄버거 메뉴 */}
      <div className="flex flex-col w-full h-12 px-4 font-bold bg-orange-300 border-2 border-black sm:hidden">
        {isMenuOpen && (
          <div className="flex items-center justify-between">
            <Link href="/" className="px-2 py-2 bg-yellow-300">
              Home
            </Link>
            <Link href="/search" className="px-2 py-2 bg-yellow-300">
              검색
            </Link>
            <Link href="/community" className="px-2 py-2 bg-yellow-300">
              게시판
            </Link>
            <Link href="/auth/Login" className="px-2 py-2 bg-yellow-300">
              Login
            </Link>
            <Link href="/auth/Signup" className="px-2 py-2 bg-yellow-300">
              회원가입
            </Link>{" "}
          </div>
        )}
      </div>
      {isMenuOpen && <div className="flex flex-col gap-2 mt-4"></div>}
    </>
  );
}
