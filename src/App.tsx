/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  User as FirebaseUser
} from './firebase';
import { 
  signInWithRedirect, 
  getRedirectResult,
  browserPopupRedirectResolver
} from 'firebase/auth';
import {
  Cpu, 
  Terminal, 
  Cpu as Microchip, 
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  PlayCircle, 
  Trophy,
  Search,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Zap,
  Flame,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { Page, ComponentItem, FaultScenario, FaultResult, FaultStep, Course, QuizQuestion } from './types';
import { COMPONENTS, FAULT_SCENARIOS, QUIZ_QUESTIONS, ACADEMY_COURSES } from './constants';

// --- Shared Components ---

const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
    onClick={onClick}
    className={`glass-card p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const NeonButton = ({ children, onClick, variant = 'blue', className = "" }: { children: React.ReactNode, onClick?: () => void, variant?: 'blue' | 'pink' | 'purple', className?: string }) => {
  const colors = {
    blue: 'border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,229,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]',
    pink: 'border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,46,99,0.3)] hover:shadow-[0_0_20px_rgba(255,46,99,0.6)]',
    purple: 'border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(123,97,255,0.3)] hover:shadow-[0_0_20px_rgba(123,97,255,0.6)]'
  };

  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 border rounded-lg font-display text-xs tracking-widest transition-all duration-300 active:scale-95 ${colors[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Page Components ---

const PanelPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="neon-border-blue flex flex-col items-center">
          <div className="p-3 bg-neon-blue/10 rounded-full mb-4">
            <Zap className="w-8 h-8 text-neon-blue" />
          </div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#7B61FF]">Toplam XP</h3>
          <p className="text-3xl font-display mt-1">4,250</p>
          <div className="w-full bg-accent-bg h-1.5 rounded-full mt-4 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="progress-gradient h-full" />
          </div>
        </GlassCard>
        
        <GlassCard className="neon-border-blue flex flex-col items-center">
          <div className="p-3 bg-neon-purple/10 rounded-full mb-4">
            <Flame className="w-8 h-8 text-neon-purple" />
          </div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#7B61FF]">Günlük Seri</h3>
          <p className="text-3xl font-display mt-1">12 Gün</p>
        </GlassCard>

        <GlassCard className="neon-border-blue flex flex-col items-center">
          <div className="p-3 bg-neon-pink/10 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-neon-pink" />
          </div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#7B61FF]">Sıralama</h3>
          <p className="text-3xl font-display mt-1">#42</p>
        </GlassCard>

        <GlassCard className="neon-border-blue flex flex-col items-center">
          <div className="p-3 bg-emerald-500/10 rounded-full mb-4">
            <Star className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#7B61FF]">Seviye</h3>
          <p className="text-3xl font-display mt-1">8</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Günlük Görevler</h2>
            <span className="text-xs text-neon-blue">Tümünü Gör</span>
          </div>
          <div className="space-y-4">
            {[
              { t: '5 Arıza Senaryosu Çöz', d: '250 XP', p: 80 },
              { t: 'PLC Quizinde %90 Başarı Sağla', d: '100 XP', p: 0 },
              { t: '3 Yeni Komponent Keşfet', d: '50 XP', p: 100 }
            ].map((task, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.p === 100 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-neon-blue/20 text-neon-blue'}`}>
                  {task.p === 100 ? <CheckCircle2 size={24} /> : <div className="text-xs font-bold">{task.p}%</div>}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{task.t}</h4>
                  <p className="text-xs opacity-50">{task.d}</p>
                </div>
                {task.p < 100 && <ChevronRight className="opacity-30" />}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h2 className="text-xl">AI Önerileri</h2>
          <div className="p-4 bg-neon-blue/5 rounded-xl border border-neon-blue/20 space-y-3">
            <div className="flex items-center gap-2 text-neon-blue">
              <Bot size={18} />
              <span className="text-sm font-display">SİSTEM ANALİZİ</span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              "Sensör bağlantılarında zayıf görünüyorsun. <b>İndüktif Sensörler</b> konusuna göz atmanı öneririm. Son 3 hatan bu alanda."
            </p>
            <NeonButton variant="blue" className="w-full text-xs" onClick={() => setPage('library')}>KEŞFET</NeonButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const LibraryPage = () => {
  const [selected, setSelected] = useState<ComponentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = COMPONENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl">Bileşen Kütüphanesi</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text"
            placeholder="Bileşen ara..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:border-neon-blue/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <GlassCard 
            key={item.id} 
            onClick={() => setSelected(item)}
            className="group hover:neon-border-blue transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-neon-blue/10 rounded-xl group-hover:bg-neon-blue/20 transition-colors">
                <Microchip className="text-neon-blue" size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-sm opacity-60 line-clamp-2">{item.description}</p>
            <div className="mt-6 flex items-center text-xs text-neon-blue font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              DETAYLARI GÖR <ChevronRight size={14} className="ml-1" />
            </div>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card p-8 neon-border-blue"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <XCircle size={24} className="text-white/50" />
              </button>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="text-xs text-neon-blue font-display tracking-widest mb-1 block">{selected.category}</span>
                    <h2 className="text-3xl">{selected.name}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <section>
                      <h4 className="text-neon-blue text-sm font-display mb-2">ÇALIŞMA PRENSİBİ</h4>
                      <p className="text-sm opacity-80 leading-relaxed">{selected.principle}</p>
                    </section>
                    <section>
                      <h4 className="text-neon-blue text-sm font-display mb-2">GERÇEK KULLANIM ALANI</h4>
                      <p className="text-sm opacity-80 leading-relaxed">{selected.usage}</p>
                    </section>
                    <section>
                      <h4 className="text-neon-pink text-sm font-display mb-2">OLASI ARIZALAR</h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.faults.map((f, i) => (
                          <span key={i} className="text-[10px] bg-neon-pink/10 text-neon-pink border border-neon-pink/20 px-2 py-1 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

                <div className="w-full md:w-80 space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h4 className="text-xs font-display mb-4 opacity-50">TEKNİK ÖZELLİKLER</h4>
                    <div className="space-y-3">
                      {Object.entries(selected.specs).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="opacity-40">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-neon-blue/10 border border-neon-blue/30 rounded-2xl relative overflow-hidden group">
                    <Bot className="absolute bottom-[-10px] right-[-10px] text-neon-blue opacity-10 w-24 h-24" />
                    <h4 className="text-xs font-display mb-2 text-neon-blue">AI TEKNİK YORUMU</h4>
                    <p className="text-xs italic opacity-80 relative z-10">{selected.aiNote}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaultRobotPage = () => {
  const [activeScenario, setActiveScenario] = useState<FaultScenario | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [result, setResult] = useState<FaultResult | null>(null);

  const startScenario = (sc: FaultScenario) => {
    setActiveScenario(sc);
    setCurrentStepId(sc.steps[0].id);
    setResult(null);
  };

  const currentStep = activeScenario?.steps.find(s => s.id === currentStepId);

  const reset = () => {
    setActiveScenario(null);
    setCurrentStepId(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!activeScenario ? (
        <>
          <div className="text-center space-y-4">
            <h1 className="text-4xl text-neon-blue">Arıza Tespit Robotu</h1>
            <p className="opacity-60">AI destekli dinamik arıza analiz motoru. Bir senaryo seçin ve teşhis koyun.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAULT_SCENARIOS.map(sc => (
              <GlassCard key={sc.id} onClick={() => startScenario(sc)} className="group border-neon-blue/20 hover:neon-border-blue">
                <Bot className="text-neon-blue mb-4" size={32} />
                <h3 className="text-xl mb-2">{sc.title}</h3>
                <p className="text-sm opacity-60 mb-6">{sc.description}</p>
                <div className="flex items-center text-xs font-display text-neon-blue">
                  SİSTEMİ BAŞLAT <ChevronRight size={16} />
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={reset}
                className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors"
              >
                <XCircle size={24} />
              </button>
              <div>
                <h2 className="text-xl text-neon-blue">{activeScenario.title}</h2>
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <Terminal size={12} />
                  DURUM: ANALİZ DEVAM EDİYOR...
                </div>
              </div>
            </div>
            <div className="text-xs bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full border border-neon-blue/30">
              SENARYO MODU
            </div>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key={currentStepId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-2xl"
                >
                  <GlassCard className="neon-border-blue p-10 text-center space-y-8">
                    <h3 className="text-2xl font-light italic">"{currentStep?.question}"</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentStep?.options.map((opt, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            if (opt.result) setResult(opt.result);
                            else if (opt.nextStepId) setCurrentStepId(opt.nextStepId);
                          }}
                          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-neon-blue/10 hover:border-neon-blue/50 transition-all font-display tracking-widest text-sm"
                        >
                          {opt.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-6"
                >
                  <GlassCard className="neon-border-blue border-neon-pink/30 p-10 space-y-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <AlertTriangle size={120} className="text-neon-pink" />
                    </div>
                    
                    <div className="flex items-center gap-3 text-neon-pink">
                      <Bot size={24} />
                      <h2 className="text-2xl font-display">ARI ZA TESPİTİ TAMAMLANDI</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs text-white/40 mb-1">TEŞHİS</h4>
                          <p className="text-2xl text-neon-pink font-semibold">{result.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-white/40 mb-1">ÇÖZÜM ÖNERİSİ</h4>
                          <p className="text-sm border-l-2 border-neon-pink/30 pl-4 py-2 italic">{result.solution}</p>
                        </div>
                      </div>

                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="opacity-50">Risk Seviyesi:</span>
                          <span className={`font-bold ${result.riskLevel === 'High' ? 'text-neon-pink' : 'text-amber-500'}`}>{result.riskLevel}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="opacity-50">Tahmini Süre:</span>
                          <span className="font-bold text-neon-blue">{result.estimatedTime}</span>
                        </div>
                        <div className="pt-4 border-t border-white/5 h-20 overflow-y-auto">
                          <h4 className="text-[10px] text-neon-blue mb-1">AI ANALİZ NOTU</h4>
                          <p className="text-[10px] opacity-70 leading-relaxed">{result.aiComment}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-6">
                      <NeonButton onClick={reset} variant="pink">YENİ SENARYO</NeonButton>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

const QuizPage = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0 && selectedAns === null) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedAns === null) {
      handleAnswer(-1);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, selectedAns]);

  const handleAnswer = (idx: number) => {
    setSelectedAns(idx);
    const correct = idx === QUIZ_QUESTIONS[currentQIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + (timeLeft * 10));
    }
    
    setTimeout(() => {
      if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setTimeLeft(15);
        setSelectedAns(null);
        setIsCorrect(null);
      } else {
        setGameState('end');
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      {gameState === 'start' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
          <Gamepad2 size={80} className="mx-auto text-neon-blue drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]" />
          <h1 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple uppercase">AI Quiz Show</h1>
          <p className="text-xl opacity-60">Hızlı düşün, doğru cevapla, XP'leri topla!</p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs">
              <Clock className="mx-auto mb-2 text-neon-blue" size={18} />
              15 SANİYE SÜRE
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs">
              <Trophy className="mx-auto mb-2 text-neon-pink" size={18} />
              MEGA XP BONUSU
            </div>
          </div>
          <button 
            onClick={() => setGameState('playing')}
            className="group relative px-12 py-4 bg-neon-blue text-dark-bg font-display font-black text-xl tracking-[0.2em] rounded-full overflow-hidden hover:scale-105 transition-transform"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            BAŞLA
          </button>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <div className="w-full space-y-10">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-display text-neon-blue">SKOR: {score}</div>
            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-display ${timeLeft < 5 ? 'border-neon-pink text-neon-pink animate-pulse' : 'border-neon-blue text-neon-blue'}`}>
              {timeLeft}
            </div>
            <div className="text-sm opacity-50">SORU: {currentQIndex + 1}/{QUIZ_QUESTIONS.length}</div>
          </div>

          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              className="h-full bg-neon-blue"
            />
          </div>

          <GlassCard className="p-12 text-center text-3xl font-light italic min-h-[160px] flex items-center justify-center">
            "{QUIZ_QUESTIONS[currentQIndex].question}"
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUIZ_QUESTIONS[currentQIndex].options.map((opt, i) => (
              <button
                key={i}
                disabled={selectedAns !== null}
                onClick={() => handleAnswer(i)}
                className={`
                  p-6 rounded-2xl border-2 text-lg transition-all duration-300 relative overflow-hidden group
                  ${selectedAns === i 
                    ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-neon-pink/20 border-neon-pink text-neon-pink')
                    : 'bg-white/5 border-white/10 hover:border-neon-blue/50 hover:bg-neon-blue/5'
                  }
                  ${selectedAns !== null && i === QUIZ_QUESTIONS[currentQIndex].correctAnswer && !isCorrect ? 'bg-emerald-500/10 border-emerald-500/50' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-display group-hover:bg-neon-blue/20 transition-colors">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-medium">{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'end' && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center space-y-10">
          <Trophy size={100} className="mx-auto text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
          <div className="space-y-2">
            <h1 className="text-5xl font-display italic">Tebrikler!</h1>
            <p className="text-lg opacity-60">Quiz performansın AI tarafından analiz edildi.</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl grid grid-cols-2 gap-10">
            <div>
              <div className="text-xs opacity-50 uppercase tracking-widest mb-1">Toplam Skor</div>
              <div className="text-4xl text-neon-blue font-display">{score}</div>
            </div>
            <div>
              <div className="text-xs opacity-50 uppercase tracking-widest mb-1">Kazanılan XP</div>
              <div className="text-4xl text-neon-purple font-display">+{Math.floor(score * 0.1)}</div>
            </div>
          </div>

          <div className="p-6 bg-neon-blue/5 border border-neon-blue/20 rounded-2xl text-left max-w-md">
            <div className="flex items-center gap-2 text-neon-blue mb-2">
              <Bot size={16} />
              <span className="text-[10px] font-display">AI ANALİZİ</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed italic">
              "PLC mimarisinde hatasız ilerliyorsun ancak teorik sensör sorularında hızın azaldı. Pratik simülasyonları denemelisin."
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <NeonButton variant="blue" onClick={() => {
              setGameState('start');
              setCurrentQIndex(0);
              setScore(0);
              setTimeLeft(15);
              setSelectedAns(null);
            }}>TEKRAR DENE</NeonButton>
            <NeonButton variant="purple">PAYLAŞ</NeonButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SimulationPage = () => {
  const [plcInput1, setPlcInput1] = useState(false);
  const [plcInput2, setPlcInput2] = useState(false);
  const [motorRunning, setMotorRunning] = useState(false);
  const [thermalError, setThermalError] = useState(false);

  // Simple AND Logic: Input 1 (Start) AND NOT Thermal AND Input 2 (Safety)
  useEffect(() => {
    if (plcInput1 && !thermalError && plcInput2) {
      setMotorRunning(true);
    } else {
      setMotorRunning(false);
    }
  }, [plcInput1, plcInput2, thermalError]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Simülasyon Merkezi</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] text-emerald-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SİSTEM CANLI
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="space-y-8 p-10">
          <h2 className="text-xl border-b border-white/5 pb-4">Kontrol Paneli</h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xs opacity-50 uppercase font-display">GİRİŞLER (INPUTS)</h4>
              <div className="space-y-4">
                <button 
                  onMouseDown={() => setPlcInput1(true)}
                  onMouseUp={() => setPlcInput1(false)}
                  onMouseLeave={() => setPlcInput1(false)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${plcInput1 ? 'bg-neon-blue border-neon-blue text-dark-bg scale-95 shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-white/5 border-white/10 text-white/50'}`}
                >
                  <span className="text-sm font-display">START BUTONU</span>
                  <div className={`w-2 h-2 rounded-full ${plcInput1 ? 'bg-dark-bg' : 'bg-white/20'}`} />
                </button>

                <button 
                  onClick={() => setPlcInput2(!plcInput2)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${plcInput2 ? 'bg-neon-purple border-neon-purple text-dark-bg' : 'bg-white/5 border-white/10 text-white/50'}`}
                >
                  <span className="text-sm font-display">GÜVENLİK SENSÖRÜ</span>
                  <div className={`w-2 h-2 rounded-full ${plcInput2 ? 'bg-dark-bg' : 'bg-white/20'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs opacity-50 uppercase font-display">ARIZALAR (FAULTS)</h4>
              <button 
                onClick={() => setThermalError(!thermalError)}
                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${thermalError ? 'bg-neon-pink border-neon-pink text-dark-bg' : 'bg-white/5 border-white/10 text-white/50'}`}
              >
                <span className="text-sm font-display">TERMİK RÖLE ATTI</span>
                <AlertTriangle size={18} className={thermalError ? 'text-dark-bg' : 'text-white/20'} />
              </button>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs leading-relaxed opacity-60 italic">
            <b>Sıralı Mantık:</b> Start butonuna basıldığında (I1) ve Güvenlik Sensörü aktifken (I2), eğer Termik bir arıza yoksa motor çalışır.
          </div>
        </GlassCard>

        <div className="flex flex-col gap-8">
          <GlassCard className="flex-1 flex flex-col items-center justify-center space-y-6 p-10">
             <h4 className="text-xs opacity-50 uppercase font-display self-start">GÖRSEL DURUM (OUTPUT)</h4>
             <div className="relative">
                <motion.div 
                  animate={motorRunning ? { rotate: 360 } : { rotate: 0 }}
                  transition={motorRunning ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0.5 }}
                  className={`w-40 h-40 rounded-full border-8 flex items-center justify-center ${motorRunning ? 'border-neon-blue shadow-[0_0_40px_rgba(0,229,255,0.3)]' : 'border-white/5'}`}
                >
                  <div className="w-4 h-32 bg-white/10 rounded-full absolute" />
                  <div className="w-32 h-4 bg-white/10 rounded-full absolute" />
                  <Cpu size={48} className={motorRunning ? 'text-neon-blue' : 'text-white/10'} />
                </motion.div>

                {thermalError && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-dark-bg/60 backdrop-blur-sm rounded-full"
                  >
                    <div className="text-center">
                      <AlertTriangle size={40} className="text-neon-pink mx-auto mb-1" />
                      <div className="text-xs text-neon-pink font-display">ERROR</div>
                    </div>
                  </motion.div>
                )}
             </div>
             
             <div className="text-center">
                <h3 className={`text-2xl font-display ${motorRunning ? 'text-neon-blue' : 'text-white/20'}`}>
                  {motorRunning ? 'MOTOR ÇALIŞIYOR' : 'MOTOR DURDU'}
                </h3>
                <p className="text-xs opacity-40 mt-1 uppercase tracking-widest">Çıkış Q0.0</p>
             </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-xs opacity-50 uppercase font-display mb-4">CANLI PLC MONITOR</h4>
            <div className="space-y-3">
              {[
                { tag: 'I0.0', name: 'Start', status: plcInput1, color: 'bg-neon-blue' },
                { tag: 'I0.1', name: 'Safety', status: plcInput2, color: 'bg-neon-purple' },
                { tag: 'I0.2', name: 'Thermal', status: thermalError, color: 'bg-neon-pink' },
                { tag: 'Q0.0', name: 'Motor', status: motorRunning, color: 'bg-emerald-500' }
              ].map((io, i) => (
                <div key={i} className="flex items-center gap-4 text-xs font-mono">
                  <div className={`w-3 h-3 rounded-full ${io.status ? io.color : 'bg-white/10'}`} />
                  <span className="w-12 opacity-50">{io.tag}</span>
                  <span className="flex-1 opacity-80">{io.name.toUpperCase()}</span>
                  <span className={`font-bold ${io.status ? 'text-white' : 'opacity-20'}`}>{io.status ? 'TRUE' : 'FALSE'}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const AcademyPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Akademi</h1>
        <div className="flex gap-4">
           {['Hepsi', 'PLC', 'Sensör', 'Elektrik'].map(cat => (
             <button key={cat} className="text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:border-neon-blue/50 transition-colors">
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ACADEMY_COURSES.map(course => (
          <GlassCard key={course.id} className="group overflow-hidden flex flex-col p-0">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.thumbnail} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt={course.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] bg-neon-blue/20 text-neon-blue border border-neon-blue/30 px-2 py-1 rounded">
                  {course.category}
                </span>
                <span className="text-[10px] bg-dark-bg/80 border border-white/10 px-2 py-1 rounded">
                  {course.level}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="opacity-60">İlerleme</span>
                  <span className="text-neon-blue">{course.progress}%</span>
                </div>
                <div className="w-full bg-accent-bg h-1.5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} className="h-full progress-gradient" />
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold group-hover:text-neon-blue transition-colors">{course.title}</h3>
              <div className="flex items-center gap-4 text-xs opacity-50">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle size={14} />
                  12 Ders
                </div>
              </div>
              <p className="text-xs opacity-60 leading-relaxed italic border-l border-neon-blue/30 pl-3">
                “{course.aiNotes}”
              </p>
              <div className="mt-auto pt-4 flex items-center justify-between">
                 <button className="flex items-center gap-2 text-xs font-display text-neon-blue group-hover:neon-text-blue transition-all">
                    BAŞLA <ArrowRight size={14} />
                 </button>
                 <button className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bell size={14} />
                 </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// --- Authentication & Boot Animation ---

const BootAnimation = ({ onFinish }: { onFinish: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "> AI SYSTEM INITIALIZING...",
    "> LOADING NEURAL KNOWLEDGE CORE (v2.4.0)...",
    "> PLC LOGIC MATRIX LOADED ENABLED",
    "> SENSOR DATA INTERPRETATION ENGINE ONLINE",
    "> FAULT DIAGNOSIS DATABASE SYNCED",
    "> QUIZ MATRIX INITIALIZED",
    "> BOOT SEQUENCE COMPLETE. WELCOME OPERATOR."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, messages[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onFinish, 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg flex items-center justify-center p-6 font-mono text-neon-blue">
      <div className="max-w-xl w-full space-y-4">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-1 bg-neon-blue"
        />
        <div className="space-y-1">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs md:text-sm tracking-widest"
            >
              {log}
            </motion.div>
          ))}
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-neon-blue align-middle ml-1"
          />
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user?: FirebaseUser) => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Önce Popup deniyoruz
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Eğer domain yetkili değilse veya popup engellendiyse redirect'e zorla
      if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        alert(`HATA: Bu alan adı (${currentDomain}) Firebase'de yetkilendirilmemiş.\n\nÇÖZÜM:\n1. Firebase Console'a gidin.\n2. Authentication > Settings > Authorized Domains kısmına "${currentDomain}" adresini ekleyin.\n\nLink: https://console.firebase.google.com/project/gen-lang-client-0913085288/authentication/settings`);
      } else if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        // Popup engellendiyse redirect yöntemine geç
        await signInWithRedirect(auth, googleProvider);
      } else {
        alert("Giriş yapılamadı: " + (error.message || "Bilinmeyen hata"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 229, 255, 0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-10 space-y-2">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="flex justify-center mb-4"
          >
            <div className="p-4 bg-neon-blue/10 rounded-3xl border border-neon-blue/30 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <Cpu size={48} className="text-neon-blue" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-display font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">OTO-MATE AKADEMİ</h1>
          <p className="text-xs uppercase tracking-[0.4em] opacity-40 font-display">AI DESTEKLİ ENDÜSTRİYEL EĞİTİM PLATFORMU</p>
        </div>

        <GlassCard className="neon-border-blue p-8 md:p-12 space-y-8">
          <div className="space-y-6 text-center">
             <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-xl">
                <p className="text-xs font-display tracking-widest text-[#00E5FF]">SİSTEME ERİŞİM İÇİN KİMLİK DOĞRULAMASI GEREKLİ</p>
             </div>
             <p className="text-sm opacity-60">Eğitim portalına devam etmek için lütfen Google hesabınızla giriş yapın.</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full group relative py-6 bg-white text-dark-bg font-display font-black tracking-[0.2em] rounded-xl overflow-hidden active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                 <div className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                 DOĞRULANIYOR...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-sans">G</span>
                GOOGLE İLE OTURUM AÇ
              </div>
            )}
          </button>

          <div className="text-center">
             <p className="text-[9px] opacity-30 font-display tracking-[0.2em]">BU TERMİNAL RESMİ OPERATÖRLER İÇİNDİR</p>
          </div>
        </GlassCard>

        <p className="text-center mt-8 text-[10px] opacity-30 font-display uppercase tracking-widest">
           SİSTEM SÜRÜMÜ: v2.4.5-FINAL // SECURE CORE: ACTIVE
        </p>
      </motion.div>
    </div>
  );
};

// --- Main Application Wrapper ---

export default function App() {
  const [authStatus, setAuthStatus] = useState<'login' | 'booting' | 'dashboard'>('login');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activePage, setActivePage] = useState<Page>('panel');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Redirect dönüşlerini yönet
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user);
        setAuthStatus('booting');
      }
    }).catch((error) => {
      console.error("Redirect login error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Eğer zaten booting aşamasındaysak veya dashboard'daysak tekrar tetikleme
        setAuthStatus((prev) => (prev === 'login' ? 'booting' : prev));
      } else {
        setUser(null);
        setAuthStatus('login');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (newUser?: FirebaseUser) => {
    if (newUser) setUser(newUser);
    setAuthStatus('booting');
  };
  const handleBootFinish = () => setAuthStatus('dashboard');
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setAuthStatus('login');
  };

  if (authStatus === 'login') return <LoginPage onLogin={handleLogin} />;
  if (authStatus === 'booting') return <BootAnimation onFinish={handleBootFinish} />;

  const menuItems = [
    { id: 'panel', label: 'Panel', icon: LayoutDashboard },
    { id: 'library', label: 'Bileşen Kütüphanesi', icon: BookOpen },
    { id: 'fault-robot', label: 'Arıza Tespit Robotu', icon: Bot },
    { id: 'quiz', label: 'AI Quiz Show', icon: Gamepad2 },
    { id: 'simulation', label: 'Simülasyon Merkezi', icon: PlayCircle },
    { id: 'academy', label: 'Akademi', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex transition-all duration-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 229, 255, 0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-card-bg/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 overflow-hidden relative flex flex-col hidden lg:flex`}
      >
        <div className="p-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-blue flex items-center justify-center shrink-0">
             <Cpu size={18} className="text-dark-bg" />
          </div>
          {sidebarOpen && <span className="font-display font-black text-xs tracking-widest italic truncate">OTO-MATE AKADEMİ</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                ${activePage === item.id 
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}
              `}
            >
              <item.icon size={20} className={activePage === item.id ? 'text-neon-blue' : 'group-hover:text-neon-blue transition-colors'} />
              {sidebarOpen && <span className="text-sm font-medium tracking-wide">{item.label}</span>}
              {activePage === item.id && sidebarOpen && (
                <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 bg-neon-blue rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-neon-pink hover:bg-neon-pink/10 rounded-xl transition-all font-display text-[10px] tracking-widest"
            >
              <LogOut size={16} />
              {sidebarOpen && 'OTURUMU KAPAT'}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto">
        {/* Navbar */}
        <header className="h-20 border-b border-white/5 bg-dark-bg/60 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-6">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors hidden lg:block">
               <Terminal size={20} className="text-neon-blue" />
             </button>
             <div className="flex flex-col">
                <h1 className="text-sm font-display tracking-widest uppercase">
                  {menuItems.find(m => m.id === activePage)?.label}
                </h1>
                <span className="text-[8px] italic opacity-30">
                  OPERATOR: {user?.email || 'Misafir'} // LEVEL 8
                </span>
             </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-display text-neon-blue">SİSTEM STABİL</span>
                <span className="text-[8px] opacity-30">2026-05-17 15:07:41</span>
              </div>
              <div className="h-6 w-px bg-white/5" />
              <button className="p-2 hover:bg-white/5 rounded-full relative">
                <Bell size={20} className="text-white/40" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full border-2 border-dark-bg" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-neon-blue/30 p-1 flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
                  ) : (
                    <User size={20} className="text-neon-blue" />
                  )}
                </div>
              </div>
           </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-6 md:p-10 pb-20">
           <AnimatePresence mode="wait">
             <motion.div
               key={activePage}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="h-full"
             >
                {activePage === 'panel' && <PanelPage setPage={setActivePage} />}
                {activePage === 'library' && <LibraryPage />}
                {activePage === 'fault-robot' && <FaultRobotPage />}
                {activePage === 'quiz' && <QuizPage />}
                {activePage === 'simulation' && <SimulationPage />}
                {activePage === 'academy' && <AcademyPage />}
                {activePage === 'settings' && (
                  <div className="flex items-center justify-center h-64 text-white/30 font-display text-xs tracking-widest italic">
                     AYARLAR MODÜLÜ DEVRE DIŞI. AI ERİŞİM İZNİ GEREKLİ.
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav (Bottom bar) */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-card-bg/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 z-50">
        {menuItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id as Page)}
            className={`p-3 rounded-2xl transition-all ${activePage === item.id ? 'bg-neon-blue/20 text-neon-blue shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'text-white/30'}`}
          >
            <item.icon size={22} />
          </button>
        ))}
      </footer>
    </div>
  );
}
