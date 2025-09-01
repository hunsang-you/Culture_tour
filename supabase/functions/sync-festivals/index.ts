// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// Supabase 클라이언트와 Deno의 Serve 모듈을 가져옵니다.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const FESTIVAL_SERVICE_KEY = Deno.env.get("FESTIVAL_SERVICE_KEY");

    if (!FESTIVAL_SERVICE_KEY) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // API의 모든 페이지의 데이터 저장
    let pageNo = 1;
    let totalCount = 0;
    const allItems = [];
    const numOfRows = 100;

    do {
      const externalApiUrl =
        `http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api?ServiceKey=${FESTIVAL_SERVICE_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&type=json`;

      const response = await fetch(externalApiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `External API request failed: ${response.statusText} - ${errorText}`,
        );
      }

      const apiData = await response.json();
      totalCount = apiData.response.body.totalCount;
      const items = apiData.response.body.items;

      if (items && Array.isArray(items)) {
        allItems.push(...items);
      }

      pageNo++;
    } while (allItems.length < totalCount);

    if (!allItems || allItems.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No data to insert or invalid data structure.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const seen = new Set();
    const uniqueItems = allItems.filter(item => {
      const uniqueKey = `${item.fstvlNm}-${item.fstvlStartDate}-${item.fstvlEndDate}`;
      if (seen.has(uniqueKey)) {
        return false;
      }
      seen.add(uniqueKey);
      return true;
    });

    const festivalsToInsert = uniqueItems.map((item) => {
      const latitude = item.latitude && item.latitude !== ""
        ? parseFloat(item.latitude)
        : null;
      const longitude = item.longitude && item.longitude !== ""
        ? parseFloat(item.longitude)
        : null;

      return {
        name: item.fstvlNm,
        opar: item.opar,
        start_date: item.fstvlStartDate,
        end_date: item.fstvlEndDate,
        fstvlCo: item.fstvlCo,
        mnnstNm: item.mnnstNm,
        auspcInsttNm: item.auspcInsttNm,
        suprtInsttNm: item.suprtInsttNm,
        phone: item.phoneNumber,
        homepage: item.homepageUrl,
        relateInfo: item.relateInfo,
        road_address: item.rdnmadr,
        address: item.lnmadr,
        latitude: latitude,
        longitude: longitude,
        reference_date: item.referenceDate,
        instt_code: item.instt_code,
        instt_name: item.instt_nm,
      };
    });

    const { data, error } = await supabaseClient
      .from("festivals")
      .upsert(festivalsToInsert, {
        onConflict: 'name,start_date,end_date',
      });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "축제 데이터가 성공적으로 동기화되었습니다.",
        insertedCount: data ? data.length : 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
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
