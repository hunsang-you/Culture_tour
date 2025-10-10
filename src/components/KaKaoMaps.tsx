"use client";

import { Festival } from "@/types/data";
import { useEffect, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

export default function KakaoMap({
  festivals,
  userLocation,
}: {
  festivals: Festival[];
  userLocation: { lat: number; lng: number } | null;
}) {
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_KEY!,
  });

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
