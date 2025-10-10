// app/api/festival/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Supabase에서 festival 테이블 조회 (페이지네이션 적용)
    const { data, error } = await supabase.from("festivals").select("*");

    if (error) throw error;
    console.log(data);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Supabase 호출 에러:", err);
    return NextResponse.json({ error: "DB 호출 실패" }, { status: 500 });
  }
}
