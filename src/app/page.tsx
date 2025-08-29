"use client";

import { useEffect, useState } from "react";
import { fetchFestivalData } from "@/api/festival";
import KaKaoMaps from "@/components/KaKaoMaps";
import { Festival } from "@/types/data";

export default function Home() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [searchInput, setSearchInput] = useState("");

  // ✅ 공공데이터 API 호출
  useEffect(() => {
    async function loadFestivals() {
      const data = await fetchFestivalData(1, 20);
      if (data?.response?.body?.items) {
        setFestivals(data.response.body.items);
      }
    }
    loadFestivals();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 검색 영역 */}
      <div className="p-4 bg-gray-100 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="지역명 입력"
          className="flex-1 border p-2 rounded"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
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
          <button
            key={region}
            onClick={() => setSearchInput(region)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            {region}
          </button>
        ))}
      </div>

      {/* 지도 */}
      <div className="w-full h-[360px] border-2 border-black">
        <KaKaoMaps />
      </div>

      {/* 하단 축제 리스트 */}
      <div className="h-48 overflow-y-auto border-t bg-gray-50 p-2">
        {festivals.length > 0 ? (
          festivals.map((fstvl, idx) => (
            <div
              key={idx}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
            >
              <div className="font-bold">{fstvl.fstvlNm}</div>
              <div className="text-sm text-gray-600">
                {fstvl.opar} | {fstvl.fstvlStartDate} ~ {fstvl.fstvlEndDate}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            축제 데이터를 불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
}
