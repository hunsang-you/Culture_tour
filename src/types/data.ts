export interface Festival {
  fstvlNm: string; // 축제명
  opar: string; // 개최장소
  fstvlStartDate: string; // 축제시작일자 (YYYY-MM-DD)
  fstvlEndDate: string; // 축제종료일자 (YYYY-MM-DD)
  fstvlCo: string; // 축제내용
  mnnstNm: string; // 주관기관명
  auspcInsttNm: string; // 주최기관명
  suprtInsttNm: string; // 후원기관명
  phoneNumber: string; // 전화번호
  homepageUrl: string; // 홈페이지주소
  relateInfo: string; // 관련정보
  rdnmadr: string; // 소재지도로명주소
  lnmadr: string; // 소재지지번주소
  latitude: string; // 위도 (일부 데이터는 숫자 대신 문자열로 제공될 수 있음)
  longitude: string; // 경도
  referenceDate: string; // 데이터기준일자 (YYYY-MM-DD)
  instt_code: string; // 제공기관코드
  instt_nm: string; // 제공기관기관명
}
