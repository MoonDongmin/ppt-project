"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        router.push("/main");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("라우팅 중 에러 발생:", error);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-blue-900">
      {/* 별 애니메이션 (간단한 랜덤 점) */}
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-70 animate-pulse"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`,
          }}
            />
      ))}
      {/* DEVLIFT 텍스트 */}
      <h1
        className="text-7xl md:text-8xl font-extrabold tracking-widest text-white drop-shadow-[0_0_40px_rgba(99,102,241,0.8)] animate-glow"
        style={{
          textShadow:
            "0 0 32px #6366f1, 0 0 64px #6366f1, 0 0 128px #6366f1, 0 0 256px #6366f1",
        }}
      >
        DEVLIFT
      </h1>
      {/* 우주적 오로라 효과 (블러) */}
      <div className="absolute w-[60vw] h-[60vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 opacity-30 blur-3xl animate-pulse" />
      <style>{`
        @keyframes glow {
          0%, 100% { filter: brightness(1.2) drop-shadow(0 0 40px #6366f1); }
          50% { filter: brightness(2) drop-shadow(0 0 80px #818cf8); }
        }
        .animate-glow { animation: glow 1.2s infinite alternate; }
      `}</style>
    </div>
  );
}
