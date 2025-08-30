import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageNo = searchParams.get("pageNo") || "1";
  const numOfRows = searchParams.get("numOfRows") || "10";
  const SERVICE_KEY = process.env.FESTIVAL_SERVICE_KEY!;

  // const API_URL = process.env.FESTIVAL_API_URL!;
  const API_URL =
    "https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api";

  const params = {
    ServiceKey: SERVICE_KEY,
    pageNo,
    numOfRows,
    type: "json",
  };
  try {
    const response = await axios.get(API_URL, { params });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error("API 호출 에러:", err);
    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 });
  }
}
