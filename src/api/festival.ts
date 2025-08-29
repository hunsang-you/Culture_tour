export async function fetchFestivalData(
  pageNo: number = 1,
  numOfRows: number = 10
) {
  const FESTIVAL_SERVICE_KEY = process.env.FESTIVAL_SERVICE_KEY!;
  const API_URL = process.env.FESTIVAL_API_URL!;

  const params: Record<string, string> = {
    ServiceKey: FESTIVAL_SERVICE_KEY,
    pageNo: String(pageNo),
    numOfRows: String(numOfRows),
    type: "json",
  };

  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}?${queryString}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API 요청 실패");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API 호출 에러:", err);
    return null;
  }
}
