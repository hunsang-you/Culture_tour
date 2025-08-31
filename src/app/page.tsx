"use client";

import { useEffect, useState, useRef } from "react";
import KaKaoMap from "@/components/KaKaoMaps";
import { Festival } from "@/types/data";
import FestivalList from "@/components/FestivalList";
import Button from "@/components/UI/Button";

export default function Home() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 마우스 드래그 스크롤 기능을 위한 상태 및 ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // API Route 호출
  useEffect(() => {
    async function loadFestivals() {
      try {
        const res = await fetch(`/api/festival?pageNo=1&numOfRows=20`);
        const data = await res.json();
        if (data?.response?.body?.items) {
          setFestivals(data.response.body.items);
        }
      } catch (err) {
        console.error("API 호출 실패:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFestivals();
  }, []);

  // 마우스 드래그 스크롤 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (scrollRef.current) {
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = x - startX; // 드래그한 거리
      scrollRef.current.scrollLeft = scrollRef.current.scrollLeft - walk;
    }
  };

  return (
    // 전체 웹 페이지의 최소 너비를 Tailwind CSS의 sm (640px)으로 설정
    <div className="flex flex-col max-w-4xl mx-auto min-w-sm">
      {/* 상단 검색 영역 */}
      <div className="flex gap-2 p-4 bg-gray-100">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="지역명 입력"
          className="flex-1 p-2 border rounded"
        />
        <Button
          label="검색"
          className="px-4 py-2 font-bold text-gray-500 bg-white border-gray-200 border-1 rounded-xl hover:bg-blue-400"
        />
      </div>

      {/* 카테고리 버튼 */}
      <div
        className="flex gap-2 p-2 overflow-x-auto bg-white border-b cursor-grab"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
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
            className="bg-orange-100 hover:bg-blue-400"
          />
        ))}
      </div>

      {/* 지도: KaKaoMaps 컴포넌트 추가 */}
      <div className="w-full h-[360px] border-2 border-black">
        <KaKaoMap />
      </div>

      {/* 하단 축제 리스트 */}
      <div className="py-8">
        {isLoading ? (
          <div className="text-center text-gray-500">
            축제 데이터를 불러오는 중...
          </div>
        ) : (
          <FestivalList festivals={festivals} />
        )}
      </div>
    </div>
  );
}
