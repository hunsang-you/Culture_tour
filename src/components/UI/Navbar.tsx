"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <div className="flex items-center w-full h-12 bg-white border-2 border-black">
        <div className="flex gap-4 font-bold">
          <div>
            <Link href="/">Home</Link>
          </div>
          <div>
            <Link href="/search">검색</Link>
          </div>
          <div>
            <Link href="/community">게시판</Link>
          </div>
        </div>
      </div>
    </>
  );
}
