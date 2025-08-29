"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

export default function KakaoMap() {
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_KEY!,
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          // 실패 시 기본 위치 지정
          setUserLocation({ lat: 33.5563, lng: 126.79581 });
        }
      );
    } else {
      // 브라우저가 Geolocation을 지원하지 않을 경우
      setUserLocation({ lat: 33.5563, lng: 126.79581 });
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error("Kakao Map load error:", error);
    return <div>Error loading Kakao Map</div>;
  }
  if (!userLocation) return <div>Loading user location...</div>;
  return (
    <Map
      center={{ lat: userLocation.lat, lng: userLocation.lng }}
      level={3}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
        <div style={{ color: "#000" }}>You are here!</div>
      </MapMarker>
    </Map>
  );
}
