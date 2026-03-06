"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Terminal, Database, Cpu, Zap, Layers, GitBranch, Shield, Code2, Workflow, MessageSquare, Search, Lock, Globe, Clock, ChevronDown, Sparkles, Infinity, Target, Lightbulb, Menu, X, Play, Pause, Maximize, Minimize, Slash } from "lucide-react";

export default function LandingPage4() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollTop / docHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#FFFF00] selection:text-[#000000] overflow-x-hidden">
      
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#111111]">
        <div
          className="h-full bg-[#FFFF00]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-8 bg-[#000000]/95 backdrop-blur-sm border-b border-[#FFFFFF]/10">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#FFFF00] flex items-center justify-center">
              <span className="text-[#000000] font-black text-2xl">Q</span>
            </div>
            <span className="font-black text-3xl tracking-tighter group-hover:text-[#FFFF00] transition-colors">QUID</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xl font-bold hover:text-[#FFFF00] transition-colors">
              Features
            </Link>
            <Link href="#tech" className="text-xl font-bold hover:text-[#FFFF00] transition-colors">
              Tech
            </Link>
            <Link href="/signin" className="text-xl font-bold hover:text-[#FFFF00] transition-colors">
              Sign In
            </Link>
            <Link
              href="/signin"
              className="px-8 py-3 bg-[#FFFF00] text-[#000000] font-black text-lg hover:bg-[#FFFFFF] transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden w-14 h-14 bg-[#FFFF00] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-7 h-7 text-[#000000]" /> : <Menu className="w-7 h-7 text-[#000000]" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 border-t border-[#FFFFFF]/10 p-4 space-y-2 bg-[#000000]">
            <Link href="#features" className="block px-4 py-4 font-bold text-2xl hover:text-[#FFFF00] hover:bg-[#FFFFFF]/5 transition-colors">
              Features
            </Link>
            <Link href="#tech" className="block px-4 py-4 font-bold text-2xl hover:text-[#FFFF00] hover:bg-[#FFFFFF]/5 transition-colors">
              Tech
            </Link>
            <Link href="/signin" className="block px-4 py-4 font-bold text-2xl hover:text-[#FFFF00] hover:bg-[#FFFFFF]/5 transition-colors">
              Sign In
            </Link>
            <Link
              href="/signin"
              className="block px-4 py-4 bg-[#FFFF00] text-[#000000] font-black text-2xl hover:bg-[#FFFFFF] transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      <main className="pt-16">
        
        <section className="min-h-screen relative flex items-center justify-center px-6 md:px-12 py-32 overflow-hidden">
          <BackgroundGrid />
          
          <div className="relative z-10 max-w-[1800px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#FFFF00] mb-12">
                  <div className="w-3 h-3 bg-[#FFFF00] animate-pulse" />
                  <span className="font-black text-[#FFFF00] tracking-widest">V1.0 — NOW AVAILABLE</span>
                </div>

                <h1 className="text-[20vw] md:text-[16vw] lg:text-[14vw] font-black leading-none tracking-tighter mb-8">
                  <span className="block text-[#FFFFFF]">NOTES</span>
                  <span className="block text-[#FFFF00]">EVOLVE</span>
                  <span className="block text-[#FFFFFF]">TASKS</span>
                  <span className="block text-[#FFFF00]">RESOLVE</span>
                </h1>

                <div className="max-w-2xl">
                  <p className="text-3xl md:text-4xl font-medium text-[#FFFFFF] mb-12 leading-relaxed">
                    Notes are <span className="text-[#FFFF00] font-black">potential energy</span>. Tasks are that energy <span className="bg-[#FFFF00] text-[#000000] px-3 py-1 font-black">activated</span>. One system. Zero friction.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/signin"
                      className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#FFFF00] text-[#000000] font-black text-2xl hover:bg-[#FFFFFF] transition-all"
                    >
                      Start Free
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <Link
                      href="#features"
                      className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-transparent text-[#FFFFFF] font-black text-2xl border-2 border-[#FFFFFF] hover:border-[#FFFF00] hover:text-[#FFFF00] transition-all"
                    >
                      Explore
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative hidden lg:block">
                <div className="aspect-square relative">
                  <div className="absolute inset-0 border-[3px] border-[#FFFFFF]/20" />
                  <div className="absolute inset-8 border-[3px] border-[#FFFF00]" />
                  <div className="absolute inset-16 bg-[#FFFF00] flex items-center justify-center">
                    <div className="text-[#000000] font-black text-9xl tracking-tighter">
                      Q
                    </div>
                  </div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-[2px] bg-[#FFFF00]" />
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-32 h-[2px] bg-[#FFFF00]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-32 bg-[#FFFF00]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-32 bg-[#FFFF00] transform rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-10 h-10 text-[#FFFF00]" />
          </div>
        </section>

        <section className="py-32 bg-[#FFFFFF] border-t-[3px] border-[#000000]">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <MarqueeSection />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 bg-[#000000]">
          <div className="max-w-[1800px] mx-auto">
            <ProblemSection />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 bg-[#FFFF00] border-t-[3px] border-[#000000]">
          <div className="max-w-[1800px] mx-auto">
            <ConceptSection />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 bg-[#FFFFFF] border-t-[3px] border-[#000000]">
          <div className="max-w-[1800px] mx-auto">
            <WhySection />
          </div>
        </section>

        <section id="features" className="py-32 px-6 md:px-12 bg-[#000000]">
          <div className="max-w-[1800px] mx-auto">
            <FeaturesSection />
          </div>
        </section>

        <section id="tech" className="py-32 px-6 md:px-12 bg-[#FFFFFF] border-t-[3px] border-[#000000]">
          <div className="max-w-[1800px] mx-auto">
            <TechSection />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 bg-[#000000] border-t-[3px] border-[#FFFF00]">
          <div className="max-w-[1800px] mx-auto">
            <AISection />
          </div>
        </section>

        <section className="py-32 px-6 md:px-12 bg-[#FFFF00] border-t-[3px] border-[#000000]">
          <div className="max-w-[1800px] mx-auto">
            <CTASection />
          </div>
        </section>

      </main>

      <footer className="py-16 px-6 md:px-12 bg-[#000000] border-t-[3px] border-[#FFFFFF]">
        <div className="max-w-[1800px] mx-auto">
          <FooterSection />
        </div>
      </footer>

    </div>
  );
}

function BackgroundGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-2 bg-[#FFFF00]"
          style={{
            left: `${(i * 12.5) + 6}%`,
            top: `${(i * 10) + 20}%`
          }}
        />
      ))}
    </div>
  );
}

function MarqueeSection() {
  const text = "NO FOLDERS • NO LIMITS • AI POWERED • REAL-TIME • ";
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 25 }}
        className="flex whitespace-nowrap"
      >
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[10vw] md:text-[8vw] font-black text-[#000000] px-12 uppercase tracking-tighter">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ProblemSection() {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1">
        <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#FFFFFF]/20 mb-12">
          <Slash className="w-5 h-5 text-[#FFFFFF]" />
          <span className="font-black text-[#FFFFFF] tracking-widest">THE PROBLEM</span>
        </div>

        <h2 className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-none tracking-tighter mb-12">
          <span className="block text-[#FFFFFF]">HIERARCHIES</span>
          <span className="block text-[#FFFF00]">KILL</span>
          <span className="block text-[#FFFFFF]">CREATIVITY</span>
        </h2>

        <div className="space-y-8 text-2xl md:text-3xl font-medium text-[#FFFFFF]/80 leading-relaxed">
          <p>
            For decades we&apos;ve forced our fluid thoughts into rigid boxes: folders, subfolders, nested structures that make sense to computers but not to human brains.
          </p>
          <p>
            Your ideas don&apos;t live in isolation. They connect, cross-reference, and evolve. Yet your tools force you to choose where each thought belongs before it even exists.
          </p>
        </div>
      </div>

      <div className="flex-1 lg:border-l-[3px] lg:border-l-[#FFFFFF]/10 lg:pl-12">
        <div className="bg-[#FFFFFF] p-12">
          <div className="mb-8 pb-8 border-b-2 border-[#000000]">
            <span className="font-black text-[#000000] tracking-widest text-lg">TRADITIONAL_SYSTEM</span>
          </div>

          <div className="font-mono text-xl md:text-2xl space-y-6">
            <div className="text-[#000000]/40">
              📁 Documents
            </div>
            <div className="text-[#000000]/60 ml-8">
              📁 Projects
            </div>
            <div className="text-[#000000]/80 ml-16">
              📁 2024
            </div>
            <div className="text-[#FFFF00] ml-24">
              📄 idea_drafted_jan.docx
            </div>

            <div className="mt-12 p-8 bg-[#000000] border-2 border-[#000000]">
              <div className="font-black text-[#FFFF00] text-xl mb-4">ERROR</div>
              <div className="text-[#000000] text-lg">
                Cannot locate context.<br />
                Original connection lost in nested hierarchy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptSection() {
  const concepts = [
    {
      step: "01",
      title: "NOTE",
      subtitle: "Potential Energy",
      description: "Capture raw ideas, thoughts, and concepts. These are your building blocks—the raw material of creativity waiting to be activated.",
      bgColor: "bg-[#FFFFFF]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]"
    },
    {
      step: "02",
      title: "THE BRIDGE",
      subtitle: "Activation",
      description: "Transform notes into tasks. AI suggests actions based on your ideas. One system. No friction.",
      bgColor: "bg-[#000000]",
      textColor: "text-[#FFFFFF]",
      borderColor: "border-[#FFFFFF]"
    },
    {
      step: "03",
      title: "TASK",
      subtitle: "Kinetic Energy",
      description: "Activate notes into actionable tasks. Every task maintains its link to original idea—you never lose the why.",
      bgColor: "bg-[#FFFFFF]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]"
    }
  ];

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#000000] mb-16">
        <Slash className="w-5 h-5 text-[#000000]" />
        <span className="font-black text-[#000000] tracking-widest">CORE CONCEPT</span>
      </div>

      <h2 className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-black leading-none tracking-tighter mb-20">
        <span className="block text-[#000000]">TWO STATES</span>
        <span className="block text-[#FFFFFF]">ONE FLOW</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {concepts.map((concept, i) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className={`${concept.bgColor} ${concept.textColor} p-12 border-[3px] ${concept.borderColor}`}
          >
            <div className="font-black text-[12vw] md:text-[8vw] leading-none tracking-tighter mb-8 opacity-20">
              {concept.step}
            </div>
            <h3 className="text-5xl md:text-6xl font-black mb-4">{concept.title}</h3>
            <p className="font-bold text-lg mb-6 opacity-60">{concept.subtitle}</p>
            <p className="text-xl leading-relaxed">{concept.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WhySection() {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#000000] mb-16">
        <Slash className="w-5 h-5 text-[#000000]" />
        <span className="font-black text-[#000000] tracking-widest">THE NAME</span>
      </div>

      <div className="mb-16">
        <h2 className="text-[20vw] md:text-[16vw] lg:text-[12vw] font-black leading-none tracking-tighter">
          QUID?
        </h2>
      </div>

      <div className="space-y-12 text-2xl md:text-3xl font-medium text-[#000000]/80 leading-relaxed">
        <p>
          In Latin, <span className="bg-[#FFFF00] px-4 py-2 font-black text-[#000000]">&quot;quid&quot;</span> means <span className="font-black">&quot;something&quot;</span> — the essence of a thing.
        </p>
        
        <div className="p-12 bg-[#000000] text-[#FFFFFF] border-[3px] border-[#000000]">
          <p className="text-3xl md:text-4xl font-medium leading-relaxed">
            &quot;There is a reason why you wrote this note. There is an essence — a Quid — waiting to be unleashed.&quot;
          </p>
        </div>

        <p className="font-black text-[#FFFF00]">
          MENTAL PRECISION.
        </p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "PURE MARKDOWN",
      description: "Lightning-fast, distraction-free editor with syntax highlighting and keyboard-only controls.",
      icon: <Terminal className="w-10 h-10" />
    },
    {
      title: "TWO-LEVEL HIERARCHY",
      description: "Top-level notes feed into activated tasks. Linked notes become nested children.",
      icon: <Layers className="w-10 h-10" />
    },
    {
      title: "MULTIPLE VIEWS",
      description: "Table, Timeline, Kanban — see your work from every angle.",
      icon: <Workflow className="w-10 h-10" />
    },
    {
      title: "TAG SYSTEM",
      description: "Customizable colors, global management, and instant autocomplete.",
      icon: <Database className="w-10 h-10" />
    },
    {
      title: "COMMAND PALETTE",
      description: "Navigate instantly with Cmd+K. Search everything in milliseconds.",
      icon: <Search className="w-10 h-10" />
    },
    {
      title: "SMART SCHEDULING",
      description: "Visual date tracking with overdue alerts and intelligent suggestions.",
      icon: <Clock className="w-10 h-10" />
    },
    {
      title: "STATUS TRACKING",
      description: "Idle, Active, Completed — unified across notes and tasks.",
      icon: <GitBranch className="w-10 h-10" />
    },
    {
      title: "PRIVACY FIRST",
      description: "Export to JSON anytime. Delete with 30-day recovery window.",
      icon: <Shield className="w-10 h-10" />
    },
    {
      title: "INSTANT SYNC",
      description: "Real-time updates across all devices powered by Convex.",
      icon: <Zap className="w-10 h-10" />
    }
  ];

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#FFFFFF]/20 mb-16">
        <Slash className="w-5 h-5 text-[#FFFFFF]" />
        <span className="font-black text-[#FFFFFF] tracking-widest">FEATURES</span>
      </div>

      <h2 className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-black leading-none tracking-tighter mb-20">
        <span className="block text-[#FFFFFF]">BUILT FOR</span>
        <span className="block text-[#FFFF00]">DEEP WORK</span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-[#FFFFFF] text-[#000000] p-10 border-[3px] border-[#FFFFFF]/20 hover:border-[#FFFF00] transition-colors"
          >
            <div className="text-[#FFFF00] mb-6">{feature.icon}</div>
            <h3 className="text-2xl md:text-3xl font-black mb-4">{feature.title}</h3>
            <p className="text-lg leading-relaxed opacity-80">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TechSection() {
  const techs = [
    { name: "NEXT.JS 14", desc: "App Router + RSC", icon: <Code2 className="w-10 h-10" /> },
    { name: "CONVEX", desc: "Real-time database", icon: <Database className="w-10 h-10" /> },
    { name: "AI MODELS", desc: "Task generation", icon: <Cpu className="w-10 h-10" /> },
    { name: "TYPESCRIPT", desc: "Type-safe dev", icon: <Globe className="w-10 h-10" /> },
    { name: "FRAMER MOTION", desc: "Fluid animations", icon: <MessageSquare className="w-10 h-10" /> },
    { name: "CONVEX AUTH", desc: "Secure auth", icon: <Lock className="w-10 h-10" /> }
  ];

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#000000] mb-16">
        <Slash className="w-5 h-5 text-[#000000]" />
        <span className="font-black text-[#000000] tracking-widest">TECHNOLOGY</span>
      </div>

      <h2 className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-black leading-none tracking-tighter mb-20">
        <span className="block text-[#000000]">MODERN TECH</span>
        <span className="block text-[#FFFF00]">ZERO COMPROMISE</span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techs.map((tech, i) => (
          <div key={tech.name} className="bg-[#000000] text-[#FFFFFF] p-10 border-[3px] border-[#000000]">
            <div className="text-[#FFFF00] mb-6">{tech.icon}</div>
            <h3 className="text-2xl md:text-3xl font-black mb-2">{tech.name}</h3>
            <p className="text-lg opacity-60">{tech.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AISection() {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1">
        <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-[#FFFFFF]/20 mb-12">
          <Slash className="w-5 h-5 text-[#FFFFFF]" />
          <span className="font-black text-[#FFFFFF] tracking-widest">AI INTEGRATION</span>
        </div>

        <h2 className="text-[10vw] md:text-[8vw] lg:text-[7vw] font-black leading-none tracking-tighter mb-12">
          <span className="block text-[#FFFFFF]">INTELLIGENCE</span>
          <span className="block text-[#FFFF00]">BUILT IN</span>
        </h2>

        <p className="text-2xl md:text-3xl font-medium text-[#FFFFFF]/80 mb-12 leading-relaxed">
          Powered by advanced AI models, QUID transforms scattered notes into coherent, actionable tasks. The AI understands context and proposes smart activations.
        </p>

        <ul className="space-y-6 text-xl md:text-2xl font-medium text-[#FFFFFF]/80">
          {[
            "Analyze multiple notes simultaneously",
            "Generate 3 actionable task proposals",
            "Maintain semantic understanding",
            "Zero configuration required"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-3 h-3 bg-[#FFFF00] mt-3 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 lg:border-l-[3px] lg:border-l-[#FFFFFF]/10 lg:pl-12">
        <div className="bg-[#FFFFFF] p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b-[3px] border-[#000000]">
            <div className="w-16 h-16 bg-[#FFFF00] flex items-center justify-center">
              <Cpu className="w-8 h-8 text-[#000000]" />
            </div>
            <div className="text-left">
              <span className="font-black text-[#000000] text-2xl">QUID AI</span>
              <p className="text-[#000000]/60">llm-powered</p>
            </div>
          </div>

          <div className="font-mono text-xl space-y-6">
            <div className="text-[#000000]/60">
              <span className="text-[#FFFF00]">input:</span> [3 notes selected]
            </div>
            <div className="p-6 bg-[#000000] border-[2px] border-[#000000]">
              <div className="text-[#FFFFFF] space-y-2">
                • User research insights<br />
                • Competitor analysis notes<br />
                • Feature brainstorm session
              </div>
            </div>
            <div className="text-[#000000]/60">
              <span className="text-[#FFFF00]">output:</span> 3 task proposals
            </div>
            <div className="space-y-3">
              <div className="p-6 bg-[#FFFF00] border-[2px] border-[#FFFF00] text-[#000000]">
                1. Define research methodology
              </div>
              <div className="p-6 bg-[#000000] border-[2px] border-[#000000] text-[#FFFFFF]">
                2. Schedule competitor audit
              </div>
              <div className="p-6 bg-[#FFFF00] border-[2px] border-[#FFFF00] text-[#000000]">
                3. Create feature prioritization matrix
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <div className="max-w-5xl mx-auto text-center bg-[#000000] p-16 md:p-24 border-[3px] border-[#000000]">
      <h2 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-none tracking-tighter mb-12">
        <span className="block text-[#000000]">READY TO</span>
        <span className="block text-[#FFFF00]">EXECUTE?</span>
      </h2>

      <p className="text-2xl md:text-3xl font-medium text-[#000000]/80 mb-16 leading-relaxed">
        Stop managing notes. Start activating ideas into action. Your thoughts deserve better than folders.
      </p>

      <Link
        href="/signin"
        className="inline-flex items-center justify-center gap-4 px-16 py-8 bg-[#FFFF00] text-[#000000] font-black text-3xl hover:bg-[#FFFFFF] transition-all"
      >
        Start Free
        <ArrowRight className="w-10 h-10" />
      </Link>

      <p className="mt-12 text-xl text-[#000000]/60 font-medium">
        NO CREDIT CARD REQUIRED • 14-DAY FREE TRIAL
      </p>
    </div>
  );
}

function FooterSection() {
  return (
    <>
      <div className="grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2 md:border-r-[3px] md:border-r-[#FFFFFF]/10 md:pr-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#FFFF00] flex items-center justify-center">
              <span className="text-[#000000] font-black text-3xl">Q</span>
            </div>
            <span className="font-black text-4xl tracking-tighter">QUID</span>
          </div>
          <p className="text-2xl text-[#FFFFFF]/80 mb-8 leading-relaxed">
            Notes evolve. Tasks resolve.<br />
            One system. Zero friction.
          </p>
          <div className="flex gap-4">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <a key={social} href="#" className="px-6 py-3 border-[2px] border-[#FFFFFF]/20 text-[#FFFFFF]/80 font-bold hover:border-[#FFFF00] hover:text-[#FFFF00] transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-[#FFFF00] text-xl mb-8">PRODUCT</h4>
          <ul className="space-y-4">
            {["Features", "Technology", "Pricing", "Changelog"].map((item) => (
              <li key={item}>
                <a href="#" className="text-xl text-[#FFFFFF]/80 hover:text-[#FFFF00] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[#FFFF00] text-xl mb-8">LEGAL</h4>
          <ul className="space-y-4">
            {["Privacy", "Terms", "Security"].map((item) => (
              <li key={item}>
                <a href="#" className="text-xl text-[#FFFFFF]/80 hover:text-[#FFFF00] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 pt-12 border-t-[3px] border-[#FFFFFF]/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xl text-[#FFFFFF]/60 font-medium">
          © {new Date().getFullYear()} QUID. All rights reserved.
        </p>
        <p className="text-xl text-[#FFFFFF]/60 font-medium">
          Made for thinkers and doers
        </p>
      </div>
    </>
  );
}
