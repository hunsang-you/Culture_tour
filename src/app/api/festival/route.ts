import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageNo = searchParams.get("pageNo") || "1";
  const numOfRows = searchParams.get("numOfRows") || "10";
  const SERVICE_KEY = process.env.FESTIVAL_SERVICE_KEY!;

  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.FESTIVAL_API_URL!
      : "api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api";

  const url = new URL(API_URL);
  url.searchParams.append("ServiceKey", SERVICE_KEY);
  url.searchParams.append("pageNo", pageNo);
  url.searchParams.append("numOfRows", numOfRows);
  url.searchParams.append("type", "json");

  try {
    const response = await fetch(url.toString());

    // 에러 상태 코드 확인
    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API 호출 에러:", err);
    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 });
  }
}
