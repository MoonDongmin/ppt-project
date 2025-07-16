"use client";
import { useState, useRef, useEffect } from "react";

// PPT 썸네일 예시 데이터
const pptThumbnails = [
  {
    id: 1,
    title: "능력으로 다시 도약",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "감사 인사 모음집",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "LOVE & THANKS SPRING FLOWER",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "비즈니스 스타트업",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  // {
  //   id: 5,
  //   title: "심플 모던 템플릿",
  //   img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?auto=format&fit=crop&w=400&q=80",
  // },
  // {
  //   id: 6,
  //   title: "컬러풀 인포그래픽",
  //   img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  // },
];

// 카운트업에 사용할 목표 숫자 상수
const STATS = [
  { icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="mx-auto text-blue-500"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ), label: "월간 활성 사용자 수", target: 2000000, unit: "200만 +" },
  { icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="mx-auto text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
    ), label: "서비스 국가 수", target: 180, unit: "180 +" },
  { icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="mx-auto text-blue-500"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21l6-6"/><path d="M14.828 14.828a4 4 0 1 0-5.656-5.656"/></svg>
    ), label: "디자인 다운로드 수", target: 400000000, unit: "4억 +" },
];

// 메인 카운트업 목표값
const MAIN_COUNT_TARGET = 14635992;

export default function MainPage() {
  // 로그인/회원가입 모달 상태
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  // 폼 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 썸네일 캐러셀 스크롤 참조
  const carouselRef = useRef<HTMLDivElement>(null);

  // 자동 캐러셀 타이머 ref
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // 마지막 스크롤 시각 ref (수동 조작 시 타이머 리셋)
  const lastScrollTime = useRef<number>(Date.now());

  // 캐러셀 좌우 스크롤 함수 (수동 조작 시 타이머 리셋)
  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    // 현재 스크롤 위치 저장
    // scrollPos.current = carouselRef.current.scrollLeft; // 제거
    // 스크롤 이동
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    // 수동 조작 시각 기록
    lastScrollTime.current = Date.now();
  };

  // 무한 캐러셀을 위한 썸네일 3배 렌더링 (앞뒤로 복제)
  const infiniteThumbnails = [
    ...pptThumbnails,
    ...pptThumbnails,
    ...pptThumbnails,
  ];

  // 캐러셀 최초 렌더 시 중앙(원본 시작점)으로 위치 조정
  useEffect(() => {
    if (carouselRef.current) {
      // 한 세트(원본) 길이만큼 이동 (중앙)
      const itemWidth = 280 + 24; // min-w + gap
      carouselRef.current.scrollLeft = pptThumbnails.length * itemWidth;
    }
  }, []);

  // 무한 캐러셀 효과: 스크롤이 끝/처음에 도달하면 중앙(원본)으로 자연스럽게 점프
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const itemWidth = 280 + 24;
      const total = pptThumbnails.length;
      const setWidth = total * itemWidth;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      // 오른쪽 끝(4번이 끝나고 1번이 보이기 시작할 때) 도달 시 중앙 세트로 점프
      if (scrollLeft >= setWidth * 2 - clientWidth) {
        // 한글 주석: 오른쪽 끝에서 자연스럽게 중앙 세트로 점프
        carouselRef.current.scrollLeft = scrollLeft - setWidth;
      }
      // 왼쪽 끝 도달 시 중앙으로 점프
      if (scrollLeft < setWidth) {
        carouselRef.current.scrollLeft = scrollLeft + setWidth;
      }
    };
    const ref = carouselRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, [pptThumbnails.length]);

  // 캐러셀 자동 스크롤 useEffect (무한 루프)
  useEffect(() => {
    autoScrollTimer.current = setInterval(() => {
      if (!carouselRef.current) return;
      if (Date.now() - lastScrollTime.current < 2000) return;
      const itemWidth = 280 + 24;
      carouselRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }, 3000);
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [pptThumbnails.length]);

  // 스크롤 시 통계 섹션이 보이면 카운트업 시작
  useEffect(() => {
    const handleScroll = () => {
      // if (!statsRef.current) return; // 제거
      // const rect = statsRef.current.getBoundingClientRect(); // 제거
      // if (rect.top < window.innerHeight * 0.8 && !countStarted) { // 제거
      //   setCountStarted(true); // 제거
      // } // 제거
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 제거

  // 메인 숫자 상태값 (카운트업용)
  const [mainCount, setMainCount] = useState(0);
  // 통계 숫자 상태값 (카운트업용)
  const [counts, setCounts] = useState([0, 0, 0]);

  // 통계 숫자 카운트업 애니메이션
  useEffect(() => {
    // 각 통계별 카운트업 지속시간(ms)
    const durations = [1200, 1200, 1200];
    // 각 통계별 카운트업 interval(ms)
    const intervals = STATS.map((stat, i) => Math.max(10, durations[i] / stat.target));
    let current = [0, 0, 0];
    const timers = STATS.map((stat, i) => setInterval(() => {
      // 증가량 계산
      current[i] += Math.ceil(stat.target / (durations[i] / intervals[i]));
      if (current[i] >= stat.target) {
        current[i] = stat.target;
        setCounts((prev) => { const next = [...prev]; next[i] = stat.target; return next; });
        clearInterval(timers[i]);
      } else {
        setCounts((prev) => { const next = [...prev]; next[i] = current[i]; return next; });
      }
    }, intervals[i]));
    return () => timers.forEach(clearInterval);
  }, []);

  // 메인 숫자 카운트업 애니메이션
  useEffect(() => {
    const duration = 1200; // ms
    const interval = Math.max(10, duration / MAIN_COUNT_TARGET);
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(MAIN_COUNT_TARGET / (duration / interval));
      if (current >= MAIN_COUNT_TARGET) {
        current = MAIN_COUNT_TARGET;
        setMainCount(MAIN_COUNT_TARGET);
        clearInterval(timer);
      } else {
        setMainCount(current);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password || (authModal === 'signup' && !nickname)) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setSuccess(authModal === 'login' ? "로그인 성공! (예시)" : "회원가입이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-extrabold text-blue-600 tracking-widest">DEVLIFT</span>
            <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
              <a href="#" className="hover:text-blue-600">템플릿</a>
              <a href="#" className="hover:text-blue-600">추천 기능</a>
              <a href="#" className="hover:text-blue-600">요금제</a>
            </nav>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="px-4 py-2 rounded font-bold text-gray-600 hover:text-blue-600"
              onClick={() => setAuthModal('login')}
            >
              로그인
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 shadow"
              onClick={() => setAuthModal('signup')}
            >
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* 중앙 Hero 섹션 */}
      <section className="flex flex-col items-center justify-center flex-1 py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6 leading-tight">세상의 모든 디자인은<br className="hidden md:block" /> DEVLIFT로 완성</h1>
        <p className="text-lg md:text-xl text-gray-500 text-center mb-10">PPT와 카드뉴스부터 동영상까지 템플릿으로 쉽고 간편하게 시작해보세요!</p>
        <div className="flex gap-4 mb-12">
          <button className="px-8 py-3 rounded bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 shadow">바로 시작하기</button>
          <button className="px-8 py-3 rounded border-2 border-blue-500 text-blue-600 font-bold text-lg bg-white hover:bg-blue-50 shadow">템플릿 보러가기</button>
        </div>
      </section>

      {/* PPT 썸네일 캐러셀 */}
      <section className="w-full bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">추천 템플릿</h2>
            {/* 화살표(좌우 버튼) 제거됨 */}
          </div>
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-2" style={{scrollBehavior:'smooth'}}>
            {infiniteThumbnails.map((ppt, idx) => (
              <div key={idx} className="min-w-[280px] max-w-[280px] bg-gray-50 rounded-xl shadow hover:shadow-lg transition flex-shrink-0 border border-gray-200 cursor-pointer">
                <img src={ppt.img} alt={ppt.title} className="w-full h-44 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{ppt.title}</h3>
                  <button className="mt-2 w-full py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">템플릿으로 시작</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 통계/성과 섹션 - 스크롤 시 등장, 숫자 카운트업 */}
      <section className="w-full bg-white py-16 border-t flex flex-col items-center">
        <div className="mb-2 text-lg font-semibold text-blue-400">누구나 쉽게 쓸 수 있는</div>
        <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 text-center">
          {/* 메인 숫자 카운트업 표시 */}
          {mainCount.toLocaleString()}+명이 사랑하는 제품
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center mb-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center min-w-[120px]">
              <div className="w-14 h-14 rounded-xl bg-gray-50 border flex items-center justify-center mb-3 shadow-sm">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {/* 통계 숫자 카운트업 표시 및 단위 가공 */}
                {(() => {
                  const value = counts[i];
                  // 만/억 단위 변환
                  if (i === 0) {
                    return value >= 2000000 ? '200만 +' : (value >= 10000 ? `${Math.floor(value / 10000)}만+` : value.toLocaleString());
                  } else if (i === 1) {
                    return value >= 180 ? '180 +' : value;
                  } else {
                    return value >= 400000000 ? '4억 +' : (value >= 10000 ? `${Math.floor(value / 10000)}만+` : value.toLocaleString());
                  }
                })()}
              </div>
              <div className="text-gray-500 text-sm text-center">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="text-base md:text-lg font-semibold text-blue-400 mb-2">53만 개 이상의 템플릿</div>
        <div className="text-xl md:text-2xl font-extrabold text-gray-900 text-center">프레젠테이션, 동영상, SNS 등<br className="md:hidden"/> 모든 템플릿이 한 곳에</div>
      </section>

      {/* 로그인/회원가입 모달 */}
      {authModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setAuthModal(null); setError(""); setSuccess(""); }}
              aria-label="닫기"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">{authModal === 'login' ? '로그인' : '회원가입'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-900">이메일</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="이메일 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-900">비밀번호</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="비밀번호 입력 (6자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {authModal === 'signup' && (
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-gray-900">닉네임</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder:text-gray-400 bg-white"
                    placeholder="닉네임 입력"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                  />
                </div>
              )}
              {error && <div className="mb-2 text-red-700 text-base font-semibold">{error}</div>}
              {success && <div className="mb-2 text-green-700 text-base font-semibold">{success}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-bold text-lg hover:bg-blue-700 transition mt-2 shadow"
              >
                {authModal === 'login' ? '로그인' : '회원가입'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* 애니메이션 스타일 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s; }
      `}</style>
    </div>
  );
} 