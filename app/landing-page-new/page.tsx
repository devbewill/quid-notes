"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Terminal, Database, Cpu, Zap, Layers, GitBranch, Shield, Code2, Workflow, MessageSquare, Search, Lock, Globe, Clock, ChevronDown, Sparkles, Infinity, Target, Lightbulb, Menu, X, Play, Pause } from "lucide-react";

export default function LandingPageNew() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">QUID</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="#tech" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              Technology
            </Link>
            <Link href="/signin" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link
              href="/signin"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20"
            >
              Get Started →
            </Link>
          </div>

          <button 
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden px-6 py-4 border-t border-slate-200 mt-4 space-y-4 bg-white">
            <Link href="#features" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">
              Features
            </Link>
            <Link href="#tech" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">
              Technology
            </Link>
            <Link href="/signin" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">
              Sign In
            </Link>
            <Link
              href="/signin"
              className="block bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition-all text-center"
            >
              Get Started →
            </Link>
          </div>
        )}
      </nav>

      <main className="pt-16">

        <section className="min-h-screen relative overflow-hidden">
          <HeroAnimation isPlaying={isPlaying} />
          
          <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-20 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-emerald-700">v1.0 — Now Available</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                Your thoughts,<br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  fully alive.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                Transform scattered notes into <strong className="text-slate-900 font-medium">actionable intelligence</strong>. The first workspace that understands your ideas evolve into execution.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signin"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full sm:w-auto bg-slate-100 text-slate-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause Animation" : "Play Animation"}
                </button>
              </div>

              <div className="mt-16 flex items-center justify-center gap-8 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4" />
                  <span>Unlimited Notes</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <ChevronDown className="w-6 h-6 text-slate-400 animate-bounce" />
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <TrustBadges />
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <ProblemSolutionSection />
          </div>
        </section>

        <section className="py-32 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto">
            <ConceptFlowSection />
          </div>
        </section>

        <section className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <WhyQuidSection />
          </div>
        </section>

        <section id="features" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <FeaturesBentoGrid />
          </div>
        </section>

        <section id="tech" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <TechStack />
          </div>
        </section>

        <section className="py-32 px-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="max-w-4xl mx-auto">
            <AIDemoSection />
          </div>
        </section>

        <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FinalCTA />
          </div>
        </section>

      </main>

      <footer className="py-16 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <FooterContent />
        </div>
      </footer>

    </div>
  );
}

function HeroAnimation({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50" />
      
      {isPlaying && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-[20%] left-[10%] w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-[60px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="absolute top-[60%] right-[15%] w-40 h-40 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-[80px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="absolute bottom-[30%] left-[30%] w-36 h-36 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full blur-[70px]"
          />

          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0 
              }}
              animate={{ 
                y: [0, -100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)] opacity-50" />
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-12">
        Trusted by teams at
      </p>
      <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
        {["Google", "Microsoft", "Meta", "Amazon", "Apple", "Netflix"].map((company, i) => (
          <motion.div
            key={company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-2xl font-bold text-slate-400"
          >
            {company}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProblemSolutionSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
          <AlertIcon />
          <span className="text-sm font-semibold text-red-700">The Problem</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Your tools are<br />
          <span className="relative">
            working against you
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
              <path d="M2 4C50 1 150 7 198 4" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </span>
        </h2>
        <p className="text-xl text-slate-600 mb-6 leading-relaxed">
          Traditional note-taking apps force you to choose where each thought belongs before it even exists. Folders, tags, hierarchies—architectures that make sense to computers, not to your brain.
        </p>
        <p className="text-lg text-slate-500 leading-relaxed">
          The result? Ideas get lost in nested structures. Connections break. The spark that inspired you becomes impossible to retrieve when you need it most.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-slate-400 text-sm ml-2 font-mono">traditional_workflow</span>
          </div>
          
          <div className="space-y-4 font-mono text-sm">
            {[
              { indent: 0, text: "📁 Projects", color: "text-slate-600" },
              { indent: 1, text: "📁 2024", color: "text-slate-500" },
              { indent: 2, text: "📁 Q1", color: "text-slate-400" },
              { indent: 3, text: "📄 idea.docx", color: "text-slate-300" },
              { indent: 0, text: "📁 Personal", color: "text-slate-600" },
              { indent: 1, text: "📁 Journal", color: "text-slate-500" },
              { indent: 2, text: "📄 ???", color: "text-red-400" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 ${item.color}`} style={{ paddingLeft: `${item.indent * 24}px` }}>
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs font-semibold mb-1">⚠️ SYSTEM WARNING</p>
              <p className="text-red-500 text-xs">
                Where should this go? The structure forces a choice before the thought is complete.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ConceptFlowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Core Philosophy</span>
      </div>

      <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        Ideas have<br />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          momentum.
        </span>
      </h2>

      <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
        Notes are potential energy. Tasks are that energy activated. QUID bridges the gap between thinking and doing.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "CAPTURE",
            subtitle: "Potential Energy",
            description: "Raw thoughts, ideas, and concepts. The raw material waiting for direction.",
            color: "from-emerald-400 to-teal-400",
            bg: "bg-emerald-500/10"
          },
          {
            icon: <Zap className="w-8 h-8" />,
            title: "ACTIVATE",
            subtitle: "The Bridge",
            description: "Transform notes into tasks. AI suggests actions based on your ideas.",
            color: "from-teal-400 to-cyan-400",
            bg: "bg-teal-500/10"
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "EXECUTE",
            subtitle: "Kinetic Energy",
            description: "Actionable items with clear paths to completion. Never lose the why.",
            color: "from-cyan-400 to-emerald-400",
            bg: "bg-cyan-500/10"
          }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
            <div className={`relative bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 h-full`}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} mb-6 shadow-lg`}>
                <span className="text-white">{item.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{item.subtitle}</p>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {isInView && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-emerald-500" />
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-teal-500" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function WhyQuidSection() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-semibold text-purple-700">The Meaning</span>
        </div>

        <h2 className="text-6xl md:text-8xl font-bold text-slate-900 mb-8 tracking-tight">
          QUID
        </h2>

        <div className="mb-8">
          <p className="text-2xl md:text-3xl text-slate-600 mb-4 font-light leading-relaxed">
            Latin for <strong className="text-slate-900 font-medium">&quot;something&quot;</strong> — the essence of a thing.
          </p>
          <p className="text-xl text-slate-500 italic">
            &quot;There is a reason why you wrote this note. There is an essence — a Quid — waiting to be unleashed.&quot;
          </p>
        </div>

        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full blur-md opacity-50" />
          <div className="relative bg-white rounded-full px-8 py-4 border border-slate-200">
            <p className="text-lg text-slate-700 font-medium">
              A name for those who value mental precision.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeaturesBentoGrid() {
  const features = [
    {
      title: "Pure Markdown",
      description: "Lightning-fast, distraction-free editor with syntax highlighting and keyboard-only controls.",
      icon: <Terminal className="w-6 h-6" />,
      span: "col-span-2"
    },
    {
      title: "Real-time Sync",
      description: "Instant updates across all devices powered by Convex. No refresh needed.",
      icon: <Zap className="w-6 h-6" />,
      span: "col-span-1"
    },
    {
      title: "Multiple Views",
      description: "Table, Timeline, Kanban — see your work from every angle.",
      icon: <Workflow className="w-6 h-6" />,
      span: "col-span-1"
    },
    {
      title: "Smart Scheduling",
      description: "Visual date tracking with overdue alerts and intelligent suggestions.",
      icon: <Clock className="w-6 h-6" />,
      span: "col-span-1"
    },
    {
      title: "Command Palette",
      description: "Navigate instantly with Cmd+K. Search everything in milliseconds.",
      icon: <Search className="w-6 h-6" />,
      span: "col-span-2"
    },
    {
      title: "Privacy First",
      description: "Export to JSON anytime. Delete with 30-day recovery window.",
      icon: <Shield className="w-6 h-6" />,
      span: "col-span-1"
    },
    {
      title: "Tag System",
      description: "Customizable colors, global management, and instant autocomplete.",
      icon: <Layers className="w-6 h-6" />,
      span: "col-span-1"
    },
    {
      title: "Status Tracking",
      description: "Idle, Active, Completed — unified across notes and tasks.",
      icon: <GitBranch className="w-6 h-6" />,
      span: "col-span-1"
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Features</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
          Everything you need,<br />
          <span className="text-slate-400">nothing you don&apos;t.</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Purpose-built for deep work. Every feature exists to help you think better, not add complexity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className={`${feature.span} bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:shadow-slate-900/5 transition-all hover:-translate-y-1 group`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TechStack() {
  const techs = [
    {
      category: "Frontend",
      items: [
        { name: "Next.js 14", desc: "App Router + RSC", icon: <Code2 className="w-5 h-5" /> },
        { name: "TypeScript", desc: "Type-safe development", icon: <Globe className="w-5 h-5" /> },
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Convex", desc: "Real-time database", icon: <Database className="w-5 h-5" /> },
        { name: "Convex Auth", desc: "Secure authentication", icon: <Lock className="w-5 h-5" /> },
      ]
    },
    {
      category: "AI & Animation",
      items: [
        { name: "LLM Models", desc: "Task generation", icon: <Cpu className="w-5 h-5" /> },
        { name: "Framer Motion", desc: "Fluid animations", icon: <MessageSquare className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-6">
          <Cpu className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700 uppercase tracking-wider">Technology</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
          Built with the<br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            absolute best.
          </span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          No compromises. Every technology chosen for performance, reliability, and developer experience.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {techs.map((group, groupIndex) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: groupIndex * 0.1, duration: 0.6 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-200"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">{group.category}</h3>
            <div className="space-y-6">
              {group.items.map((item, itemIndex) => (
                <div key={item.name} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AIDemoSection() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-4 py-2 mb-8 shadow-lg shadow-emerald-500/25">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">AI-Powered</span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Intelligence that<br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            understands context.
          </span>
        </h2>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
          QUID AI analyzes your notes and proposes smart, actionable tasks. It connects the dots so you can focus on execution.
        </p>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-900">QUID AI</span>
                <p className="text-xs text-slate-500">Analyzing 3 notes...</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Input Notes</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  User research insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  Competitor analysis notes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  Feature brainstorm session
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-slate-400">
                <ArrowDown />
                <span className="text-sm font-medium">AI Processing</span>
                <ArrowDown />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Proposed Tasks</p>
              <div className="space-y-2">
                {[
                  { color: "emerald", title: "Define research methodology" },
                  { color: "teal", title: "Schedule competitor audit" },
                  { color: "cyan", title: "Create feature prioritization matrix" },
                ].map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className={`bg-${task.color}-50 border border-${task.color}-200 rounded-xl p-4 flex items-center gap-3`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${task.color}-100 flex items-center justify-center text-${task.color}-600`}>
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 font-medium">{task.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckBadge />
            <span>Analyzes multiple notes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckBadge />
            <span>Maintains context</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckBadge />
            <span>Zero configuration</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckBadge() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FinalCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        Ready to think<br />
        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          differently?
        </span>
      </h2>
      <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
        Join thousands who've transformed how they capture ideas and execute on them. Your future self will thank you.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/signin"
          className="w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-white/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
        >
          Start Free Today
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-sm text-slate-500">
          No credit card required • 14-day free trial
        </p>
      </div>
    </motion.div>
  );
}

function FooterContent() {
  return (
    <>
      <div className="grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">QUID</span>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed max-w-md">
            Notes evolve. Tasks resolve.<br />
            The workspace that understands your ideas have momentum.
          </p>
          <div className="flex gap-4">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <a key={social} href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
          <ul className="space-y-3 text-slate-600">
            <li><a href="#features" className="hover:text-slate-900 transition-colors">Features</a></li>
            <li><a href="#tech" className="hover:text-slate-900 transition-colors">Technology</a></li>
            <li><a href="/signin" className="hover:text-slate-900 transition-colors">Pricing</a></li>
            <li><a href="/signin" className="hover:text-slate-900 transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
          <ul className="space-y-3 text-slate-600">
            <li><a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a></li>
            <li><a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a></li>
            <li><a href="/signin" className="hover:text-slate-900 transition-colors">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} QUID. All rights reserved.
        </p>
        <p className="text-slate-500 text-sm">
          Made with ♥ for thinkers and doers
        </p>
      </div>
    </>
  );
}

function ArrowDown() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}
