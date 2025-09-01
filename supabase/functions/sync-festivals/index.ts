// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// Supabase 클라이언트와 Deno의 Serve 모듈을 가져옵니다.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Serve 함수를 사용하여 Deno 서버를 시작합니다.
serve(async (req) => {
  try {
    // Supabase URL과 Anon Key를 환경 변수에서 가져와 클라이언트를 생성합니다.
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // 환경 변수에서 외부 API 키를 가져옵니다.
    // 이 변수는 .env.local 파일 또는 Supabase Secrets에 설정되어야 합니다.
    const FESTIVAL_SERVICE_KEY = Deno.env.get("FESTIVAL_SERVICE_KEY");

    // API 키가 없으면 에러를 반환하여 함수 실행을 중단합니다.
    if (!FESTIVAL_SERVICE_KEY) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. 외부 API 호출
    // 공공데이터 포털의 API URL과 발급받은 키를 사용하여 요청을 보냅니다.
    const externalApiUrl = `http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api/festivals?apiKey=${FESTIVAL_SERVICE_KEY}&type=json`;

    const response = await fetch(externalApiUrl);

    // API 응답이 성공적인지 확인합니다.
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API request failed: ${response.statusText} - ${errorText}`
      );
    }

    const apiData = await response.json();

    // 2. API 응답 데이터 가공
    // 공공데이터 포털 API는 응답 구조가 다를 수 있으므로, 실제 응답에 맞춰 수정해야 합니다.
    // 아래 코드는 예시입니다.
    const items = apiData.response.body.items;

    if (!items || !Array.isArray(items)) {
      return new Response(
        JSON.stringify({
          message: "No data to insert or invalid data structure.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    //   // 데이터베이스에 저장할 형식으로 데이터를 매핑합니다.

    const festivalsToInsert = items.map((item) => ({
      name: item.fstvlNm, // 축제명
      opar: item.opar, // 개최장소
      start_date: item.fstvlStartDate, // 축제 시작일
      end_date: item.fstvlEndDate, // 축제 종료일
      fstvlCo: item.fstvlCo, // 축제내용
      mnnstNm: item.mnnstNm, // 주관기관명
      auspcInsttNm: item.auspcInsttNm, // 주최기관명
      suprtInsttNm: item.suprtInsttNm, // 후원기관명
      phone: item.phoneNumber, // 전화번호
      homepage: item.homepageUrl, // 홈페이지주소
      relateInfo: item.relateInfo, // 관련정보
      road_address: item.rdnmadr, // 소재지도로명주소
      address: item.lnmadr, // 소재지지번주소
      latitude: item.latitude, // 위도
      longitude: item.longitude, // 경도
      reference_date: item.referenceDate, // 데이터기준일자
      instt_code: item.instt_code, // 제공기관코드
      instt_name: item.instt_nm, // 제공기관기관명
    }));

    // 3. Supabase에 데이터 저장
    // 'festivals' 테이블에 가공된 데이터를 삽입합니다.
    const { data, error } = await supabaseClient
      .from("festivals")
      .insert(festivalsToInsert);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 성공 응답 반환
    return new Response(
      JSON.stringify({
        message: "축제 데이터가 성공적으로 동기화되었습니다.",
        insertedCount: data ? data.length : 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // 모든 종류의 에러를 처리하여 500 응답을 반환합니다.
    console.error("Function execution error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sync-festivals' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
