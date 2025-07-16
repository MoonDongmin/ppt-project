"use client";
import { useState } from "react";

export default function SignupPage() {
  // 폼 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  // 에러/성공 메시지 상태
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 회원가입 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // 간단한 유효성 검사
    if (!email || !password || !nickname) {
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
    // 실제 회원가입 API 연동은 추후 구현
    setSuccess("회원가입이 완료되었습니다!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-700">회원가입</h2>
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
            autoComplete="new-password"
            required
          />
        </div>
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
        {error && <div className="mb-2 text-red-700 text-base font-semibold">{error}</div>}
        {success && <div className="mb-2 text-green-700 text-base font-semibold">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold text-lg hover:bg-blue-700 transition mt-2 shadow"
        >
          회원가입
        </button>
      </form>
    </div>
  );
} 