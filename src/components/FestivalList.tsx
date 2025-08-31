import { Festival } from "@/types/data";

export default function FestivalList({ festivals }: { festivals: Festival[] }) {
  return (
    <>
      {/* 하단 축제 리스트 */}
      <div className="h-48 p-2 overflow-y-auto border-t bg-gray-50">
        {festivals.length > 0 ? (
          festivals.map((fstvl, idx) => (
            <div
              key={idx}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
            >
              <div className="font-bold">{fstvl.fstvlNm}</div>
              <div className="text-sm text-gray-600">
                {fstvl.opar} | {fstvl.fstvlStartDate} ~ {fstvl.fstvlEndDate}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            축제 데이터를 불러오는 중...
          </div>
        )}
      </div>
    </>
  );
}
