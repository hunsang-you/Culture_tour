"use client";

import { useEffect, useState, useRef } from "react";
import KaKaoMap from "@/components/KaKaoMaps";
import { Festival } from "@/types/data";
import FestivalList from "@/components/FestivalList";
import Button from "@/components/UI/Button";

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Home() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [nearFestivals, setNearFestivals] = useState<Festival[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    async function loadFestivals() {
      try {
        const res = await fetch(`/api/festival`);
        const result = await res.json();
        if (result?.data) {
          setFestivals(result.data);
        }
      } catch (err) {
        console.error("API 호출 실패:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFestivals();
  }, []);

  // 🧭 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation({ lat: 37.5665, lng: 126.978 })
      );
    } else {
      setUserLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, []);

  // 🎯 사용자 위치 기준 근처 축제 필터링
  useEffect(() => {
    if (userLocation && festivals.length > 0) {
      const filtered = festivals.filter((f) => {
        if (!f.latitude || !f.longitude) return false;
        const distance = getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          Number(f.latitude),
          Number(f.longitude)
        );
        return distance <= 50;
      });
      setNearFestivals(filtered);
      console.log("50km 이내 축제:", filtered);
    }
  }, [userLocation, festivals]);

  // ✋ 드래그 스크롤
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
    }
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (scrollRef.current) {
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = x - startX;
      scrollRef.current.scrollLeft -= walk;
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto min-w-sm">
      {/* 검색 */}
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

      {/* 카테고리 */}
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

      {/* 지도 */}
      <div className="w-full h-[360px] border-2 border-black">
        <KaKaoMap festivals={festivals} />
      </div>

      {/* 리스트: 근처 축제만 표시 */}
      <div className="py-8">
        <FestivalList festivals={nearFestivals} />
      </div>
    </div>
  );
}
