"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Layers, Workflow, CheckCircle2, Zap } from "lucide-react";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-violet-500/50 selection:text-white overflow-hidden">

      {/* ── Disruptive Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 mix-blend-difference flex justify-between items-start pointer-events-none">
        <div className="font-black text-4xl tracking-tighter leading-none pointer-events-auto text-white">
          Q <br/>UID
        </div>
        <Link
          href="/signin"
          className="pointer-events-auto group bg-white text-black px-6 py-3 font-bold text-sm tracking-widest hover:bg-violet-600 hover:text-white transition-all duration-0 border-2 border-transparent hover:border-white shadow-[4px_4px_0_0_#fff] hover:shadow-[8px_8px_0_0_#8b5cf6]"
        >
          LOG IN
        </Link>
      </nav>

      <main>

        {/* ── Brutal Hero ── */}
        <section className="min-h-screen relative flex flex-col justify-center px-6 md:px-12 pt-32 pb-24 border-b-[1px] border-zinc-800 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_60%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-zinc-800/50" />
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-zinc-800/50" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="relative z-10 w-full max-w-[1400px] mx-auto text-center md:text-left"
          >
            <h1 className="text-[14vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter text-zinc-100 uppercase mix-blend-difference mb-6">
              Controlled <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 stroke-text">Chaos.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-end">
              <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-xl text-zinc-400">
                The singularity where fluid documentation, ruthless execution, and reactive intelligence converge in a single operative engine.
              </p>
              <div className="flex flex-col md:items-end justify-end">
                <p className="text-base text-zinc-500 tracking-wide mb-8 border-l-2 md:border-l-0 md:border-r-2 border-violet-500 pl-4 md:pl-0 md:pr-4 md:text-right">
                  We killed hierarchies. No more documents lost in obsolete sub-sub-folders. QUID adopts a fluid database, powered by state-of-the-art tech and managed by integrated AI. The first OS for lateral thinking.
                </p>
                <Link
                  href="/signin"
                  className="bg-violet-600 text-white font-black text-xl px-8 py-5 flex items-center gap-4 hover:translate-x-2 transition-transform border border-transparent hover:border-violet-400 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#fff]"
                >
                  <span className="tracking-widest uppercase">Start Now</span> <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Aggressive Marquee ── */}
        <div className="bg-violet-600 text-black py-8 border-y border-zinc-900 overflow-hidden flex whitespace-nowrap -rotate-2 origin-center my-32 z-20 shadow-[0_0_80px_rgba(139,92,246,0.5)] relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
            className="flex gap-12 font-black text-6xl md:text-8xl tracking-tighter uppercase"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>NO MORE FOLDERS ✦ PURE METADATA ✦ AI DRIVEN ✦ RELATIONAL TASKS ✦ </span>
            ))}
          </motion.div>
        </div>

        {/* ── Problem Statement ── */}
        <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-12 mb-8">
              <span className="text-violet-500 font-bold uppercase tracking-widest text-sm border border-violet-500/30 bg-violet-500/10 px-4 py-2 rounded-full">The IT Architecture Problem</span>
            </div>
            <div className="lg:col-span-6 relative">
              <motion.div style={{ y: y1 }} className="absolute -inset-10 bg-fuchsia-600/10 blur-3xl -z-10 rounded-full" />
              <h2 className="text-[10vw] lg:text-[6vw] leading-[0.85] font-black tracking-tighter uppercase text-white mb-8">
                HACK THE<br/>PARADIGM.
              </h2>
              <div className="pr-8">
                <p className="text-xl md:text-2xl font-bold text-zinc-300 leading-tight mb-6 font-mono text-fuchsia-400">
                  <span className="text-zinc-500">{">"}</span> ERROR: FOLDER_HIERARCHY_OBSOLETE
                </p>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  For the last thirty years we&apos;ve been taught to organize our work by boxing it: in files, inside folders, inside drives.
                  But the human brain doesn&apos;t think in isolated compartments. It thinks in <strong className="text-white">Connections</strong>, associations, and contexts. Old hierarchical taxonomies force you to break your creative flow just to decide &quot;where to save&quot; the next document.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col gap-8 justify-center border-l-2 border-zinc-800 pl-8 lg:pl-12">
              <div className="relative flex flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-violet-500 shrink-0" />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Flat Database, Spatial Relations</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  QUID disintegrates the concept of folders. Here, everything is metadata. You create a document and simply assign its coordinates of meaning through a robust chromatic system of <strong className="text-fuchsia-500">TAGS</strong>. Information is free and transversal: traceable from any angle.
                </p>
              </div>

              <div className="relative flex flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Real-time Extrapolation</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Your flow should never stop to fill out a task form. While writing in pure Markdown during a meeting, you simply highlight a paragraph to transform it mathematically into an <strong className="text-orange-500">EXECUTABLE TASK</strong>.
                  This task stays indissolubly linked to the original note, always allowing you to trace back to &quot;why&quot; you&apos;re doing it.
                </p>
              </div>

              <div className="relative flex flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-zinc-300 shrink-0" />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Cybernetic Symbiosis (AI)</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Information grows exponentially. QUID has an integrated <strong className="text-white">conversational engine based on LLM</strong>. The assistant natively reads your data abstraction, allowing you to perform complex semantic queries across your entire archive. You write, it remembers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Technical Overview ── */}
        <section className="py-24 border-y border-zinc-900 bg-black overflow-hidden relative">
          <div className="absolute inset-0 pattern-grid-lg text-zinc-800/20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <h2 className="text-4xl text-center font-black tracking-widest text-zinc-600 mb-16 uppercase">Technology //</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="p-6 border border-zinc-800 bg-zinc-900/50 hover:border-violet-500 transition-colors">
                <div className="text-sm font-mono text-violet-400 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">01. REAL-TIME</div>
                <h4 className="text-xl font-bold text-white mb-3">Total Reactivity</h4>
                <p className="text-sm text-zinc-500">Instant synchronization across all your devices without waiting or reloads.</p>
              </div>
              <div className="p-6 border border-zinc-800 bg-zinc-900/50 hover:border-fuchsia-500 transition-colors">
                <div className="text-sm font-mono text-fuchsia-400 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">02. PERFORMANCE</div>
                <h4 className="text-xl font-bold text-white mb-3">Extreme Speed</h4>
                <p className="text-sm text-zinc-500">A lightning-fast interface designed to never let you lose your creative rhythm.</p>
              </div>
              <div className="p-6 border border-zinc-800 bg-zinc-900/50 hover:border-orange-500 transition-colors">
                <div className="text-sm font-mono text-orange-400 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">03. INTELLIGENCE</div>
                <h4 className="text-xl font-bold text-white mb-3">Advanced AI</h4>
                <p className="text-sm text-zinc-500">Integrated assistant based on Large Language Models to analyze and organize your data.</p>
              </div>
              <div className="p-6 border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500 transition-colors">
                <div className="text-sm font-mono text-emerald-400 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">04. SECURITY</div>
                <h4 className="text-xl font-bold text-white mb-3">Protected Data</h4>
                <p className="text-sm text-zinc-500">State-of-the-art authentication and encryption systems for your maximum privacy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Feature Carousel ── */}
        <FeatureShowcase />

        {/* ── Closing Call to Action ── */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-violet-600">
          <motion.div style={{ y: y2 }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.4),transparent_100%)] -z-10" />

          <h2 className="text-[18vw] leading-[0.7] font-black tracking-tighter text-violet-900/40 mb-12 pointer-events-none uppercase">
            Execute.
          </h2>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
            <h3 className="text-5xl md:text-8xl font-black text-black tracking-tighter mb-12 uppercase mix-blend-overlay">
              No more excuses.
            </h3>
            <Link
              href="/signin"
              className="px-10 py-5 bg-black text-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 border-2 border-transparent shadow-[8px_8px_0_0_#fff] hover:shadow-[16px_16px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1"
            >
              Create your space
            </Link>
          </div>
        </section>

      </main>

      <footer className="p-8 border-t-4 border-violet-600 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-zinc-500 tracking-widest uppercase gap-4 bg-[#050505]">
        <span>Quid Notes // Potential Noted // Action Defined</span>
        <span className="text-zinc-700">© {new Date().getFullYear()} All systems operational.</span>
      </footer>
    </div>
  );
}

import { useState } from "react";

const FEATURES = [
  {
    id: "markdown",
    title: "Pure Markdown",
    desc: "A lightning-fast, distraction-free editor. Write, format, and connect ideas using only your keyboard at the speed of thought.",
    icon: <Terminal className="w-8 h-8" />,
    color: "text-violet-500",
    bgColor: "bg-violet-500",
    visual: (
      <div className="w-full h-full flex flex-col gap-4 p-8 bg-[#0a0a0a] border-4 border-zinc-800 shadow-[8px_8px_0_0_#18181b]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-zinc-800 animate-pulse rounded-sm"></div>
        <div className="h-4 w-full bg-zinc-800 animate-pulse rounded-sm"></div>
        <div className="h-4 w-5/6 bg-zinc-800 animate-pulse rounded-sm"></div>
        <div className="mt-8 border-l-4 border-violet-500 mb-2 pl-4">
          <div className="h-4 w-4/5 bg-zinc-700 mt-2 rounded-sm"></div>
          <div className="h-4 w-3/5 bg-zinc-700 mt-2 rounded-sm"></div>
        </div>
      </div>
    )
  },
  {
    id: "tasks",
    title: "In-Context Tasks",
    desc: "Activities never live in a vacuum. Extract actions directly from your notes and maintain vital context around every single deadline.",
    icon: <CheckCircle2 className="w-8 h-8" />,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500",
    visual: (
      <div className="w-full h-full flex items-center justify-center p-8 bg-[#0a0a0a] border-4 border-zinc-800 shadow-[8px_8px_0_0_#18181b]">
        <div className="w-full flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-2 border-zinc-800 bg-zinc-900/50">
              <div className={`w-6 h-6 border-2 flex items-center justify-center ${i === 1 ? 'border-fuchsia-500 bg-fuchsia-500/20' : 'border-zinc-700'}`}>
                {i === 1 && <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />}
              </div>
              <div className="flex-1 h-3 bg-zinc-700 rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "ai",
    title: "AI Core",
    desc: "An integrated intelligent assistant that analyzes your entire knowledge database, answers structural questions, and organizes content.",
    icon: <Cpu className="w-8 h-8" />,
    color: "text-zinc-300",
    bgColor: "bg-zinc-300",
    visual: (
      <div className="w-full h-full flex flex-col justify-end p-8 bg-[#0a0a0a] border-4 border-zinc-800 shadow-[8px_8px_0_0_#18181b]">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-none bg-zinc-800 flex-shrink-0"></div>
          <div className="h-16 w-3/4 bg-zinc-800 rounded-sm"></div>
        </div>
        <div className="flex items-start gap-4 mb-6 flex-row-reverse">
          <div className="w-8 h-8 rounded-none bg-zinc-300 flex-shrink-0"></div>
          <div className="h-24 w-4/5 bg-zinc-700 rounded-sm border-l-4 border-zinc-300 pl-4"></div>
        </div>
        <div className="h-12 w-full border-2 border-zinc-800 mt-4 flex items-center px-4 gap-2">
          <div className="text-zinc-600 font-mono text-xs">/Ask AI...</div>
          <div className="w-1 h-4 bg-zinc-300 animate-pulse"></div>
        </div>
      </div>
    )
  },
  {
    id: "kanban",
    title: "Brutal Kanban",
    desc: "Relentless workflow visualization. Drag and drop tasks between To-Do, In Progress, and Completed instantly.",
    icon: <Workflow className="w-8 h-8" />,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
    visual: (
      <div className="w-full h-full flex gap-4 p-8 bg-[#0a0a0a] border-4 border-zinc-800 shadow-[8px_8px_0_0_#18181b]">
        {[1, 2, 3].map((col) => (
          <div key={col} className="flex-1 flex flex-col gap-4">
            <div className={`h-2 w-full ${col === 1 ? 'bg-zinc-700' : col === 2 ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
            <div className="h-24 w-full bg-zinc-900 border-2 border-zinc-800"></div>
            {col === 1 && <div className="h-20 w-full bg-zinc-900 border-2 border-zinc-800"></div>}
            {col === 2 && <div className="h-32 w-full bg-zinc-900 border-2 border-zinc-800"></div>}
          </div>
        ))}
      </div>
    )
  }
];

function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="px-6 md:px-12 mb-32 relative z-20">
      <div className="max-w-[1400px] mx-auto bg-[#0a0a0a] border border-zinc-900">
        <div className="flex flex-col lg:flex-row h-auto lg:h-[700px] divide-y lg:divide-y-0 lg:divide-x divide-zinc-900">

          {/* Left Side: List */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto">
            <div className="p-8 md:p-12 border-b border-zinc-900">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-4">Functional<br/>Arsenal.</h2>
              <p className="text-zinc-500 font-medium">Select a module to explore the power of the system.</p>
            </div>

            <div className="flex flex-col flex-1 pl-0">
              {FEATURES.map((feature, index) => {
                const isActive = activeTab === index;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-start gap-6 p-6 md:p-8 text-left transition-colors border-b border-zinc-900 last:border-b-0
                      ${isActive ? 'bg-[#050505]' : 'hover:bg-[#080808]'}
                    `}
                  >
                    <div className={`mt-1 ${isActive ? feature.color : 'text-zinc-700'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black tracking-tight uppercase mb-2 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                        {feature.title}
                      </h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-zinc-400 overflow-hidden leading-relaxed pr-4 text-sm"
                          >
                            <br/>
                            {feature.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Side: Visual */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center justify-center bg-[#050505] relative overflow-hidden h-[400px] lg:h-auto">
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-lg aspect-square relative z-10"
              >
                {FEATURES[activeTab].visual}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
