"use client";

import React, { useState } from 'react';
import { Heart, Flame, ChevronRight, RefreshCw, MessageCircle, Sparkles, Ghost } from 'lucide-react';

const App = () => {
  // --- 상태 관리 ---
  const [step, setStep] = useState('main'); // main, input, loading, result
  const [activity, setActivity] = useState('');
  const [modes, setModes] = useState({ f: true, t: true });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ f: '', t: '' });
  const [error, setError] = useState(null);

  const generateFeedback = async () => {
    setStep('loading');
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity }),
      });

      if (!response.ok) throw new Error("API 호출 실패");

      const content = await response.json();
      setResults(content);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("AI를 불러오는 데 실패했어요. 잠시 후 다시 시도해주세요.");
      setStep('input');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans p-6 selection:bg-pink-200">
      <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 mb-8">
        <div
          className="text-2xl font-black cursor-pointer tracking-tighter"
          onClick={() => setStep('main')}
        >
          SWEET <span className="text-pink-500">&</span> SALTY
        </div>
        <div className="flex gap-4">
          <span className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-slate-50">Hackathon v1.0</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        {/* 1. 메인 랜딩 */}
        {step === 'main' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            <div className="relative">
              <div className="absolute -top-10 -left-10 text-pink-400 animate-bounce"><Heart size={48} fill="currentColor" /></div>
              <div className="absolute -bottom-10 -right-10 text-orange-500 animate-pulse"><Flame size={48} fill="currentColor" /></div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-tight">
                단짠단짠<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">피드백</span>
              </h1>
            </div>
            <p className="text-xl text-slate-500 max-w-md font-medium">
              F의 무한 공감 천사와 T의 팩트 폭격 악마가<br />당신의 하루를 완벽하게 분해해 드립니다.
            </p>
            <button
              onClick={() => setStep('input')}
              className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              평가받으러 가기 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* 2. 입력 및 모드 선택 */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto py-12 space-y-10">
            <div className="space-y-4">
              <label className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="text-blue-500" /> 오늘 무엇을 하셨나요?
              </label>
              <textarea
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="예: 오늘 1시간 만에 해커톤 프로젝트를 완성해서 제출했다! 근데 운동을 못 갔다.."
                className="w-full h-40 p-6 rounded-3xl bg-white border-2 border-slate-100 focus:border-pink-300 focus:ring-0 text-lg shadow-sm resize-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xl font-bold text-slate-800">피드백 모드 선택 (중복 가능)</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setModes(prev => ({ ...prev, f: !prev.f }))}
                  className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${modes.f ? 'border-pink-400 bg-pink-50' : 'border-slate-100 bg-white opacity-50'}`}
                >
                  <Sparkles size={32} className="text-pink-500" />
                  <span className={`font-bold text-lg ${modes.f ? 'text-pink-700' : 'text-slate-400'}`}>F 천사 (Toast)</span>
                </button>
                <button
                  onClick={() => setModes(prev => ({ ...prev, t: !prev.t }))}
                  className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${modes.t ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-100 bg-white text-slate-400'}`}
                >
                  <Ghost size={32} className={modes.t ? 'text-orange-400' : 'text-slate-400'} />
                  <span className="font-bold text-lg">T 악마 (Roast)</span>
                </button>
              </div>
            </div>

            <button
              disabled={!activity || (!modes.f && !modes.t)}
              onClick={generateFeedback}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl text-2xl font-black shadow-lg disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all"
            >
              피드백 생성하기
            </button>
            {error && <p className="text-red-500 text-center font-bold">{error}</p>}
          </div>
        )}

        {/* 3. 로딩 화면 */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <RefreshCw size={64} className="text-pink-500 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-800 animate-pulse">천사와 악마의 피드백 진행중...</h2>
          </div>
        )}

        {/* 4. 결과 페이지 */}
        {step === 'result' && (
          <div className="max-w-4xl mx-auto py-8 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Your Activity</p>
              <p className="text-xl font-medium text-slate-800">"{activity}"</p>
            </div>

            <div className={`grid gap-6 ${modes.f && modes.t ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {modes.f && (
                <div className="bg-pink-50 border-2 border-pink-200 p-8 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-2 text-pink-600">
                    <Heart fill="currentColor" /> <span className="font-black text-xl italic uppercase">Angel F</span>
                  </div>
                  <p className="text-lg leading-relaxed text-pink-900 font-medium whitespace-pre-wrap">{results.f}</p>
                </div>
              )}
              {modes.t && (
                <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-[2rem] space-y-4 text-white">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Flame fill="currentColor" /> <span className="font-black text-xl italic uppercase">Devil T</span>
                  </div>
                  <p className="text-lg leading-relaxed text-slate-200 font-medium whitespace-pre-wrap">{results.t}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep('input')}
              className="w-full py-4 border-2 border-slate-200 text-slate-500 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-colors"
            >
              다시 입력하기
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-20 py-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        © 2026 Sweet & Salty AI.
      </footer>
    </div>
  );
};

export default App;
