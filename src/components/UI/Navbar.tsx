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
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <svg
                className="w-6 h-6 hover:scale-105"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        )}
        <div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:scale-105"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
