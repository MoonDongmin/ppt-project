"use client";
import { useState } from "react";

// 슬라이드 데이터 타입 정의
interface Slide {
  id: number;
  title: string;
}

export default function EditorPage() {
  // 슬라이드 리스트 상태
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, title: "첫 슬라이드" },
  ]);
  // 현재 선택된 슬라이드 ID
  const [selectedSlideId, setSelectedSlideId] = useState<number>(1);

  // 새 슬라이드 추가 함수
  const handleAddSlide = () => {
    const newId = slides.length > 0 ? slides[slides.length - 1].id + 1 : 1;
    setSlides([...slides, { id: newId, title: `슬라이드 ${newId}` }]);
    setSelectedSlideId(newId);
  };

  // 슬라이드 선택 함수
  const handleSelectSlide = (id: number) => {
    setSelectedSlideId(id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 좌측: 슬라이드 리스트 */}
      <aside className="w-56 border-r bg-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">슬라이드</span>
          <button
            className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
            onClick={handleAddSlide}
          >
            + 추가
          </button>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto">
          {slides.map((slide) => (
            <li
              key={slide.id}
              className={`px-3 py-2 rounded cursor-pointer truncate border ${slide.id === selectedSlideId ? "bg-blue-50 border-blue-400 font-semibold" : "bg-white border-gray-200"}`}
              onClick={() => handleSelectSlide(slide.id)}
            >
              {slide.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* 중앙: PPT 캔버스 영역 */}
      <main className="flex-1 flex justify-center items-center bg-white">
        <div
          className="border rounded shadow bg-gray-50 flex items-center justify-center"
          style={{ width: 800, height: 450 }}
        >
          {/* 실제 PPT 요소는 추후 추가 */}
          <span className="text-gray-400">여기에 슬라이드 내용을 추가하세요</span>
        </div>
      </main>

      {/* 우측: 도구 패널 (예시) */}
      <aside className="w-64 border-l bg-white p-4">
        <div className="font-bold mb-2">도구 패널</div>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm">텍스트 추가</button>
          <button className="w-full px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm">이미지 추가</button>
        </div>
        {/* 추후 다양한 도구 추가 가능 */}
      </aside>
    </div>
  );
} 