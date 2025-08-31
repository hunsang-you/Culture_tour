"use client";

import { useEffect, useState } from "react";
import KaKaoMaps from "@/components/KaKaoMaps";
import { Festival } from "@/types/data";
import FestivalList from "@/components/FestivalList";
import Button from "@/components/UI/Button";

export default function Home() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [searchInput, setSearchInput] = useState("");

  // API Route 호출
  useEffect(() => {
    async function loadFestivals() {
      try {
        const res = await fetch(`/api/festival?pageNo=1&numOfRows=20`);
        console.log(res);
        const data = await res.json();
        if (data?.response?.body?.items) {
          setFestivals(data.response.body.items);
        }
      } catch (err) {
        console.error("API 호출 실패:", err);
      }
    }
    loadFestivals();
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-4xl min-w-[20rem] mx-auto">
      {/* 상단 검색 영역 */}
      <div className="flex gap-2 p-4 bg-gray-100">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="지역명 입력"
          className="flex-1 p-2 border rounded"
        />
        <button className="px-4 py-2 text-white bg-blue-500 rounded">
          검색
        </button>
      </div>

      {/* 카테고리 버튼 */}
      <div className="flex gap-2 p-2 overflow-x-auto bg-white border-b">
        {[
          "서울",
          "경기도",
          "인천",
          "충청",
          "대전",
          "강원",
          "전라",
          "경상",
          "부산",
          "제주",
        ].map((region) => (
          <Button
            key={region}
            label={region}
            onClick={() => setSearchInput(region)}
          />
        ))}
      </div>

      {/* 하단 축제 리스트 */}
      <div className="py-8">
        <FestivalList festivals={festivals} />
      </div>
      {/* 지도 */}
      <div className="w-full h-[360px] border-2 border-black">
        <KaKaoMaps />
      </div>
    </div>
  );
}
