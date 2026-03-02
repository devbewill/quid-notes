"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Terminal, Database, Cpu, Zap, Layers, GitBranch, Shield, Code2, Workflow, MessageSquare, Search, Lock, Globe, Clock, ChevronRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const springY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508] text-zinc-100 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <span className="font-black text-3xl tracking-tighter text-white">QUID</span>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/signin" className="text-white font-bold text-sm tracking-widest hover:text-violet-400 transition-colors">
            SIGN IN
          </Link>
          <Link
            href="/signin"
            className="bg-white text-black px-6 py-3 font-bold text-sm tracking-widest hover:bg-violet-600 hover:text-white transition-all border-2 border-transparent hover:border-white shadow-[3px_3px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#8b5cf6] hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            GET STARTED
          </Link>
        </div>
      </nav>

      <main>

        <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 pt-20 relative overflow-hidden border-b border-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]" />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-7xl mx-auto relative z-10"
          >
            <div className="mb-8 inline-block">
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-violet-500 uppercase border border-violet-500/30 bg-violet-500/10 px-4 py-2">
                v1.0 — Now Available
              </span>
            </div>

            <h1 className="font-black tracking-tighter leading-[0.85] mb-8">
              <span className="block text-[12vw] md:text-[10vw] text-zinc-100 uppercase">Notes</span>
              <span className="block text-[12vw] md:text-[10vw] text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 uppercase">Evolve.</span>
              <span className="block text-[12vw] md:text-[10vw] text-zinc-100 uppercase">Tasks</span>
              <span className="block text-[12vw] md:text-[10vw] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 uppercase">Resolve.</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Notes are <span className="text-white font-bold">potential energy</span>. Tasks are that energy <span className="text-violet-400 font-bold">activated</span> and made actionable. One unified system for thinking and doing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signin"
                className="group bg-violet-600 text-white px-10 py-5 font-black text-lg tracking-widest uppercase hover:bg-violet-500 transition-all border-2 border-transparent hover:border-violet-400 shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#fff] hover:-translate-x-1 hover:-translate-y-1 flex items-center gap-3"
              >
                Start Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="text-zinc-400 font-bold text-sm tracking-widest uppercase hover:text-white transition-colors flex items-center gap-2"
              >
                Explore Features <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
          >
            <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-violet-500 rounded-full"
              />
            </div>
          </motion.div>
        </section>

        <section className="py-24 border-b border-zinc-900 bg-[#0a0a0f] overflow-hidden">
          <Marquee />
        </section>

        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-fuchsia-500 uppercase mb-6 block">
                The Problem
              </span>
              <h2 className="font-black text-5xl md:text-7xl tracking-tighter text-white uppercase leading-[0.9] mb-8">
                Hierarchies<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">Kill Creativity.</span>
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-6">
                For decades, we've forced our fluid thoughts into rigid boxes: folders, subfolders, nested structures that make sense to computers but not to human brains.
              </p>
              <p className="text-lg text-zinc-500 leading-relaxed">
                Your ideas don't live in isolation. They connect, cross-reference, and evolve. Yet your tools force you to choose where each thought belongs before it even exists.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-violet-600/10 blur-3xl -z-10" />
              <div className="bg-[#0f0f14] border border-zinc-800 p-8 relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-zinc-600 text-sm font-mono ml-2">traditional_system.exe</span>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <span>📁</span>
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600 ml-4">
                    <span>📁</span>
                    <span>Projects</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700 ml-8">
                    <span>📁</span>
                    <span>2024</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700 ml-12">
                    <span>📁</span>
                    <span>Q1</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-500 ml-16">
                    <span>⚠️</span>
                    <span>idea_drafted_jan.docx</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-800 text-zinc-500 text-xs">
                    ERROR: Cannot locate context. <br/>
                    Original connection lost in nested hierarchy.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 border-b border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-violet-500 uppercase mb-6 block">
              Core Concept
            </span>
            <h2 className="font-black text-5xl md:text-7xl tracking-tighter text-white uppercase leading-[0.9] mb-6">
              Two States.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">One Flow.</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Notes and tasks aren't different things—they're different states of the same thought. Seamlessly transition between potential and action.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ConceptCard
              icon={<Terminal className="w-8 h-8" />}
              title="NOTE"
              subtitle="POTENTIAL ENERGY"
              description="Capture raw ideas, thoughts, and concepts. These are your building blocks—the raw material of creativity waiting to be activated."
              color="violet"
              delay={0}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center animate-pulse">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 border-2 border-violet-500/30 rounded-full" />
              </div>
            </motion.div>
            <ConceptCard
              icon={<CheckCircle2 className="w-8 h-8" />}
              title="TASK"
              subtitle="KINETIC ENERGY"
              description="Activate notes into actionable tasks. Every task maintains its link to the original idea—you never lose the why."
              color="fuchsia"
              delay={0.4}
            />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-violet-500 uppercase mb-6 block">
              The Name
            </span>
            <h2 className="font-black text-6xl md:text-8xl tracking-tighter text-white uppercase leading-[0.9] mb-8">
              Why QUID?
            </h2>
            <p className="text-2xl md:text-3xl text-zinc-400 font-medium leading-relaxed mb-6">
              In Latin, <span className="text-white font-bold">"quid"</span> means <span className="text-fuchsia-400 font-bold">"something"</span> — the essence of a thing.
            </p>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              A name for those who value mental precision. <br/>
              <span className="text-zinc-400">"There is a reason why you wrote this note. There is an essence — a Quid — waiting to be unleashed."</span>
            </p>
          </motion.div>
        </section>

        <section id="features" className="py-32 px-6 md:px-12 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-violet-500 uppercase mb-6 block">
                Features
              </span>
              <h2 className="font-black text-5xl md:text-7xl tracking-tighter text-white uppercase leading-[0.9]">
                Built for<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Deep Work.</span>
              </h2>
            </motion.div>

            <FeatureGrid />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-fuchsia-500 uppercase mb-6 block">
                Architecture
              </span>
              <h2 className="font-black text-5xl md:text-7xl tracking-tighter text-white uppercase leading-[0.9] mb-6">
                Modern Tech.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">Zero Compromise.</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Built with cutting-edge technologies for speed, reliability, and an exceptional user experience.
              </p>
            </motion.div>

            <TechGrid />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 border-t border-zinc-900 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <div>
                <span className="font-mono text-xs font-bold tracking-[0.3em] text-violet-500 uppercase mb-6 block">
                  AI Integration
                </span>
                <h2 className="font-black text-5xl md:text-6xl tracking-tighter text-white uppercase leading-[0.9] mb-8">
                  Intelligence<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Built In.</span>
                </h2>
                <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                  Powered by advanced AI models, QUID transforms scattered notes into coherent, actionable tasks. The AI understands context and proposes smart activations.
                </p>
                <ul className="space-y-4">
                  {[
                    "Analyze multiple notes simultaneously",
                    "Generate 3 actionable task proposals",
                    "Maintain semantic understanding",
                    "Zero configuration required"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-3xl -z-10" />
                <div className="bg-[#0f0f14] border border-zinc-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-zinc-300">QUID AI</span>
                    <span className="text-zinc-600 text-sm font-mono ml-auto">llm-powered</span>
                  </div>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="text-zinc-500">
                      <span className="text-violet-400">input:</span> [3 notes selected]
                    </div>
                    <div className="text-zinc-600 bg-zinc-900/50 p-4 rounded border border-zinc-800">
                      • User research insights<br/>
                      • Competitor analysis notes<br/>
                      • Feature brainstorm session
                    </div>
                    <div className="text-zinc-500">
                      <span className="text-fuchsia-400">output:</span> 3 task proposals
                    </div>
                    <div className="space-y-2">
                      <div className="bg-violet-500/10 border border-violet-500/30 p-3 text-zinc-300">
                        1. Define research methodology
                      </div>
                      <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 p-3 text-zinc-300">
                        2. Schedule competitor audit
                      </div>
                      <div className="bg-violet-500/10 border border-violet-500/30 p-3 text-zinc-300">
                        3. Create feature prioritization matrix
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#050508] to-violet-950/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(139,92,246,0.1),transparent)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-black text-[12vw] md:text-[8vw] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500 uppercase leading-[0.85] mb-8">
                Ready to<br/>Execute?
              </h2>
              <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                Stop managing notes. Start activating ideas into action. Your thoughts deserve better than folders.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 font-black text-xl tracking-widest uppercase hover:bg-violet-600 hover:text-white transition-all border-2 border-transparent hover:border-white shadow-[8px_8px_0_0_#000] hover:shadow-[16px_16px_0_0_#fff] hover:-translate-x-1 hover:-translate-y-1"
              >
                Start Free <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <footer className="py-8 px-6 md:px-12 border-t border-zinc-900 bg-[#050508]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tighter text-white">QUID</span>
            <span className="text-zinc-600">—</span>
            <span className="text-zinc-500 text-sm tracking-wide">Notes evolve. Tasks resolve.</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-600 text-sm font-medium">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

function Marquee() {
  const text = "NO MORE FOLDERS • FLAT DATABASE • AI POWERED • METADATA DRIVEN • REAL-TIME SYNC • ";
  return (
    <div className="flex overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="font-black text-6xl md:text-8xl tracking-tighter uppercase text-zinc-800 px-8">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ConceptCard({ icon, title, subtitle, description, color, delay }: { icon: React.ReactNode, title: string, subtitle: string, description: string, color: "violet" | "fuchsia", delay: number }) {
  const colorClass = color === "violet" ? "text-violet-500 border-violet-500/30 bg-violet-500/10" : "text-fuchsia-500 border-fuchsia-500/30 bg-fuchsia-500/10";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="bg-[#0f0f14] border border-zinc-800 p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-zinc-900 rounded-bl-full" />
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg border ${colorClass} mb-6`}>
        {icon}
      </div>
      <h3 className="font-black text-2xl tracking-tight text-white uppercase mb-2">{title}</h3>
      <p className="font-mono text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">{subtitle}</p>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: <Terminal className="w-6 h-6" />,
    title: "Pure Markdown",
    description: "Write at the speed of thought with a lightning-fast, distraction-free Markdown editor. Format, structure, and connect ideas using only your keyboard.",
    tags: ["Real-time", "Syntax Highlighting", "Fullscreen Mode"]
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Two-Level Hierarchy",
    description: "Top-level notes feed into activated tasks. Linked notes become nested children, creating a natural flow from ideas to execution.",
    tags: ["Parent-Child Relations", "Context Preservation", "Traceable History"]
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: "Multiple Views",
    description: "Switch between Table, Timeline, and Kanban views. Each perspective reveals different insights about your workflow.",
    tags: ["Table", "Timeline", "Kanban Board"]
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Tag System",
    description: "Organize with a powerful tagging system with customizable colors. Create visual patterns across your entire knowledge base.",
    tags: ["Custom Colors", "Global Management", "Autocomplete"]
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Command Palette",
    description: "Navigate your entire workspace instantly. Search notes, tasks, tags, and commands with a single keyboard shortcut (Cmd+K).",
    tags: ["Keyboard First", "Instant Search", "Global Navigation"]
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Smart Scheduling",
    description: "Set start and due dates with visual feedback. Overdue items are automatically highlighted, keeping you on track.",
    tags: ["Due Dates", "Overdue Alerts", "Date Navigation"]
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Status Management",
    description: "Track progress with three unified states: idle, active, completed. Consistent across both notes and tasks.",
    tags: ["Idle", "In Progress", "Completed"]
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Privacy First",
    description: "Your data is yours. Export everything to JSON at any time. Account deletion with 30-day recovery window.",
    tags: ["Data Export", "GDPR Compliant", "Secure Auth"]
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Sync",
    description: "Real-time updates across all devices powered by Convex. No refresh needed—changes appear instantly.",
    tags: ["Convex Backend", "Real-time", "Offline Ready"]
  }
];

function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.5 }}
          className="group bg-[#0f0f14] border border-zinc-800 p-8 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-zinc-900 border border-zinc-800 mb-6 group-hover:border-violet-500 transition-colors">
            <span className="text-violet-500">{feature.icon}</span>
          </div>
          <h3 className="font-black text-xl tracking-tight text-white uppercase mb-3">{feature.title}</h3>
          <p className="text-zinc-400 leading-relaxed mb-6">{feature.description}</p>
          <div className="flex flex-wrap gap-2">
            {feature.tags.map(tag => (
              <span key={tag} className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider px-2 py-1 bg-zinc-900 border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const TECH_ITEMS = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Next.js 14",
    description: "App Router with React Server Components for optimal performance",
    category: "Frontend"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Convex",
    description: "Real-time database with built-in sync and authentication",
    category: "Backend"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "AI Models",
    description: "LLM-powered task proposal generation",
    category: "AI"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "TypeScript",
    description: "Type-safe development with full IntelliSense",
    category: "Language"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Framer Motion",
    description: "Fluid animations and smooth transitions",
    category: "Animation"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Convex Auth",
    description: "Secure authentication with email/password and Google OAuth",
    category: "Security"
  }
];

function TechGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TECH_ITEMS.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08, duration: 0.5 }}
          className="bg-[#0f0f14] border border-zinc-800 p-8 hover:border-fuchsia-500/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-fuchsia-500">{item.icon}</div>
            <span className="text-xs font-mono font-bold text-zinc-600 uppercase tracking-wider">{item.category}</span>
          </div>
          <h3 className="font-black text-xl text-white uppercase mb-2">{item.title}</h3>
          <p className="text-zinc-500 text-sm">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
