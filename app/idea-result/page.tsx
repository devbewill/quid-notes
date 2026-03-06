"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Terminal, Star } from "lucide-react";
import Link from "next/link";

export default function CaseStudyPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-violet-500/50 selection:text-white overflow-hidden"
    >
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 mix-blend-difference flex justify-between items-start pointer-events-none">
        <div className="font-black text-4xl tracking-tighter leading-none pointer-events-auto text-white">
          Q <br />
          UID
        </div>
        <Link
          href="/"
          className="pointer-events-auto group bg-white text-black px-6 py-3 font-bold text-sm tracking-widest hover:bg-violet-600 hover:text-white transition-all duration-0 border-2 border-transparent hover:border-white shadow-[4px_4px_0_0_#fff] hover:shadow-[8px_8px_0_0_#8b5cf6]"
        >
          BACK TO APP
        </Link>
      </nav>

      <main className="pt-32">
        <header className="px-6 md:px-12 py-24 border-b border-zinc-800 relative overflow-hidden">
          <motion.div
            style={{ y: y1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.1),transparent_70%)] -z-10"
          />

          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-violet-600 text-white text-xs font-black px-4 py-2 tracking-widest uppercase">
                Documented Process · From Concept to Launch
              </span>
              <span className="text-zinc-600 text-sm font-mono">
                6 Phases · 3 Months · Full-Stack
              </span>
            </div>

            <h1 className="text-[10vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-zinc-100 uppercase mb-6">
              From Idea to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                QUID
              </span>
              <br />— The Complete Journey
            </h1>

            <p className="text-2xl md:text-3xl text-zinc-400 max-w-3xl leading-relaxed mb-12">
              Documenting the creative process behind building a
              non-hierarchical productivity engine for lateral thinking and
              ruthless execution.
            </p>

            <div className="w-full aspect-[21/9] bg-[#0a0a0a] border-4 border-zinc-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_100%)]" />
              <div className="flex items-center gap-3">
                <Sparkles className="w-12 h-12 text-violet-500 animate-pulse" />
                <span className="text-zinc-600 font-mono text-sm tracking-widest">
                  THE SPARK MOMENT
                </span>
              </div>
            </div>
          </div>
        </header>

        <Phase01 />
        <Phase02 />
        <Phase03 />
        <Phase04 />
        <Phase05 />
        <Phase06 />
        <WhatILearned />
      </main>

      <FooterCTA />
    </div>
  );
}

function Phase01() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-2">
          <span className="text-violet-500 text-opacity-40 font-black text-[12vw] leading-none">
            01
          </span>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-8">
            The Spark
          </h2>

          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
            <p>
              It was another one of those Sunday afternoons. I had three
              different apps open: a notes app, a task manager, and a project
              tracker. My ideas were scattered across folders, subfolders, and
              boards. The friction was unbearable.
            </p>

            <p>
              Every time I had a thought, I had to decide where to save it. Then
              later, I&apos;d spend 10 minutes trying to remember where I put
              that crucial insight about the project. The workflow was broken.
            </p>

            <p>
              The realization hit me hard:{" "}
              <strong className="text-white">
                folders are the enemy of creative flow
              </strong>
              . They force linear thinking on non-linear minds. They create
              artificial boundaries between thoughts and actions.
            </p>
          </div>

          <blockquote className="border-l-[5px] border-violet-500 pl-6 py-4 my-12 bg-violet-500/5 border-r-2 border-t-2 border-b-2 border-zinc-800">
            <p className="text-2xl font-bold text-zinc-100 italic leading-relaxed">
              &quot;What if I could capture an idea, tag it with meaning, and
              instantly transform it into action without ever breaking
              flow?&quot;
            </p>
          </blockquote>
        </div>

        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-[#0a0a0a] border-4 border-zinc-800 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="text-center z-10">
              <Terminal className="w-16 h-16 text-violet-500 mx-auto mb-4" />
              <span className="text-zinc-600 font-mono text-sm tracking-widest">
                THE FRUSTRATION
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Phase02() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-2">
          <span className="text-fuchsia-500 text-opacity-40 font-black text-[12vw] leading-none">
            02
          </span>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-8">
            The Brainstorm
          </h2>

          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed mb-12">
            <p>
              The napkin sketches started appearing everywhere. On my phone, on
              receipts, on the back of envelopes. The core insight crystallized:{" "}
              <strong className="text-fuchsia-400">
                notes and tasks are the same thing, just in different energy
                states
              </strong>
              .
            </p>

            <p>
              A Note is potential energy. A Task is that energy activated. The
              transformation between them should be instant, frictionless, and
              traceable. Always traceable.
            </p>
          </div>

          <div className="border-4 border-zinc-800 p-6 mb-8 bg-[#0a0a0a]">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Non-Negotiable Requirements
            </h3>
            <ul className="space-y-3">
              {[
                "No folders, ever. Tag-based organization only.",
                "Instant transformation from Note to Task.",
                "Two-way relationship: Tasks must link back to source Notes.",
                "Real-time sync across all devices.",
                "AI assistance for task generation.",
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <span className="text-fuchsia-500 mt-1">✦</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="border-l-[5px] border-fuchsia-500 pl-6 py-4 bg-fuchsia-500/5 border-r-2 border-t-2 border-b-2 border-zinc-800">
            <p className="text-xl font-bold text-zinc-100 italic leading-relaxed">
              &quot;The breakthrough was realizing that hierarchy is an artifact
              of file systems, not human thinking.&quot;
            </p>
          </blockquote>
        </div>

        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-[#0a0a0a] border-4 border-zinc-800 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-zinc-700 font-mono text-xs">
              BRAINSTORM_V1.md
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="text-zinc-500"># QUID - Core Concepts</div>
              <div className="text-fuchsia-400">- Notes = Potential</div>
              <div className="text-fuchsia-400">- Tasks = Action</div>
              <div className="text-zinc-500">- Metadata {">"} Structure</div>
              <div className="text-zinc-500">- Tags = Coordinates</div>
              <div className="text-zinc-500 mt-8"># Technical</div>
              <div className="text-violet-400">- Real-time database</div>
              <div className="text-violet-400">- React components</div>
              <div className="text-violet-400">- AI integration</div>
              <div className="text-zinc-700 mt-4 cursor-blink animate-pulse">
                _
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Phase03() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-2">
          <span className="text-orange-500 text-opacity-40 font-black text-[12vw] leading-none">
            03
          </span>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-8">
            The Concept
          </h2>

          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed mb-12">
            <p>
              <strong className="text-orange-400">QUID</strong> — Latin for
              &quot;what&quot;. The question that starts every inquiry.
              Potential noted. Action defined.
            </p>

            <p>
              The design philosophy emerged:{" "}
              <strong className="text-white">
                &quot;Controlled Chaos&quot;
              </strong>
              . An interface that feels surgical yet alive. Dark mode first,
              purple accents, brutal simplicity. Every pixel serves function.
            </p>

            <p>
              The user experience had to be revolutionary. A three-view system
              that respects how people actually work:
            </p>
          </div>

          <div className="border-4 border-zinc-800 p-6 bg-[#0a0a0a]">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
              The Flow
            </h3>
            <ol className="space-y-3">
              {[
                "Capture idea instantly via QuickAdd bar",
                "Assign semantic tags with color-coded meaning",
                "Transform notes to tasks in one click (ACTIVATE)",
                "Drag tasks across Kanban boards to execute",
                "Review everything in Timeline view for perspective",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <span className="text-orange-500 font-bold">0{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-[#0a0a0a] border-4 border-zinc-800 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-zinc-700 font-mono text-xs">
              DESIGN_SYSTEM_V3.md
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-zinc-500 text-xs font-bold mb-2 uppercase">
                  Palette
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-violet-600 rounded-sm"></div>
                  <div className="w-12 h-12 bg-fuchsia-600 rounded-sm"></div>
                  <div className="w-12 h-12 bg-zinc-800 rounded-sm"></div>
                  <div className="w-12 h-12 bg-[#050505] rounded-sm border border-zinc-700"></div>
                </div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs font-bold mb-2 uppercase">
                  Typography
                </div>
                <div className="text-white font-bold text-2xl">Geist Sans</div>
                <div className="text-zinc-600 font-mono text-sm">
                  The quick brown fox
                </div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs font-bold mb-2 uppercase">
                  Philosophy
                </div>
                <div className="text-orange-400 font-bold">NO GRADIENTS</div>
                <div className="text-orange-400 font-bold">
                  NO GLASSMORPHISM
                </div>
                <div className="text-orange-400 font-bold">
                  LAYERS + SHADOWS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Phase04() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-2">
          <span className="text-violet-500 text-opacity-40 font-black text-[12vw] leading-none">
            04
          </span>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-8">
            The Build
          </h2>

          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed mb-12">
            <p>
              Technology choices were deliberate. I chose tools that would
              enable the vision, not constrain it:
            </p>
          </div>

          <div className="border-4 border-zinc-800 p-6 mb-8 bg-[#0a0a0a]">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Stack Selection
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-violet-500 mt-2"></div>
                <div>
                  <div className="text-white font-bold">
                    Next.js 14 + App Router
                  </div>
                  <div className="text-zinc-500 text-sm">
                    Modern React with server components for performance
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-fuchsia-500 mt-2"></div>
                <div>
                  <div className="text-white font-bold">Convex</div>
                  <div className="text-zinc-500 text-sm">
                    Real-time reactive database, zero-latency sync
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 mt-2"></div>
                <div>
                  <div className="text-white font-bold">
                    Tailwind CSS + Framer Motion
                  </div>
                  <div className="text-zinc-500 text-sm">
                    Utility-first styling + cinematic animations
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-zinc-400 mt-2"></div>
                <div>
                  <div className="text-white font-bold">Google Gemini API</div>
                  <div className="text-zinc-500 text-sm">
                    AI-powered task proposal generation
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-lg text-zinc-400 leading-relaxed">
            <p>
              The biggest challenge was the{" "}
              <strong className="text-white">two-level hierarchy</strong>. Notes
              could be top-level or children of tasks. This required careful
              database design with parent-child relationships and smart query
              optimization.
            </p>

            <p>
              Then came the magical moment: the first time I selected three
              notes, clicked &quot;ACTIVATE&quot;, and watched them transform
              into a task with linked sub-notes. The UI transitioned flawlessly.
              The relationship was preserved. It actually worked.
            </p>
          </div>

          <blockquote className="border-l-[5px] border-violet-500 pl-6 py-4 my-12 bg-violet-500/5 border-r-2 border-t-2 border-b-2 border-zinc-800">
            <p className="text-xl font-bold text-zinc-100 italic leading-relaxed">
              &quot;When the pieces finally clicked, it wasn&apos;t just code
              working. It was a new way of thinking taking shape.&quot;
            </p>
          </blockquote>
        </div>

        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-[#0a0a0a] border-4 border-zinc-800 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-zinc-700 font-mono text-xs">
              PACKAGE.JSON
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="text-zinc-500">{`{`}</div>
              <div className="text-orange-400 pl-4">
                &quot;name&quot;: &quot;quid-notes&quot;,
              </div>
              <div className="text-orange-400 pl-4">
                &quot;version&quot;: &quot;1.0.0&quot;,
              </div>
              <div className="text-zinc-500 pl-4">
                &quot;dependencies&quot;: {`{`}
              </div>
              <div className="text-green-400 pl-8">
                &quot;next&quot;: &quot;^14.1.0&quot;,
              </div>
              <div className="text-green-400 pl-8">
                &quot;react&quot;: &quot;^18.2.0&quot;,
              </div>
              <div className="text-green-400 pl-8">
                &quot;convex&quot;: &quot;^1.15.0&quot;,
              </div>
              <div className="text-green-400 pl-8">
                &quot;@ai-sdk/google&quot;: &quot;^0.0.49&quot;,
              </div>
              <div className="text-green-400 pl-8">
                &quot;framer-motion&quot;: &quot;^11.0.0&quot;,
              </div>
              <div className="text-green-400 pl-8">
                &quot;tailwindcss&quot;: &quot;^3.4.1&quot;,
              </div>
              <div className="text-green-400 pl-8">
                &quot;lucide-react&quot;: &quot;^0.344.0&quot;,
              </div>
              <div className="text-zinc-500 pl-4">{`}`}</div>
              <div className="text-zinc-500">{`}`}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Phase05() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-2">
          <span className="text-fuchsia-500 text-opacity-40 font-black text-[12vw] leading-none">
            05
          </span>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-8">
            The Refinement
          </h2>

          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed mb-12">
            <p>
              The MVP was working, but refinement is where products become
              great. Every feature added was intentional, every interaction
              polished.
            </p>
          </div>

          <div className="border-4 border-zinc-800 p-6 mb-8 bg-[#0a0a0a]">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Feature Deep Dive
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-white font-bold mb-1">Markdown Editor</div>
                <div className="text-zinc-500 text-sm">
                  Full-featured with toolbar, split view, fullscreen mode. No
                  distractions, just writing at the speed of thought.
                </div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">
                  Three View Modes
                </div>
                <div className="text-zinc-500 text-sm">
                  Feed for scanning, Kanban for workflow, Timeline for
                  perspective. Same data, different mental models.
                </div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Smart Tagging</div>
                <div className="text-zinc-500 text-sm">
                  Autocomplete, global color management, Enter key to add. Tags
                  are your navigation coordinates.
                </div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">
                  AI Task Generation
                </div>
                <div className="text-zinc-500 text-sm">
                  Select notes, click &quot;Generate with AI&quot;, get 3
                  actionable proposals. Intelligence when you need it.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-lg text-zinc-400 leading-relaxed">
            <p>
              Technical details mattered. The tag color system had to handle
              both global colors and per-note defaults. The edit panels needed
              to be exactly 60% wide for optimal reading. The status system
              (idle/active/completed) had to be identical for notes and tasks to
              preserve the unified philosophy.
            </p>

            <p>
              Every animation transition was tuned. Every shadow calculated.
              Every spacing token from the V3 design system applied religiously.
              The result is an interface that feels{" "}
              <strong className="text-white">mechanical and precise</strong>,
              like a well-oiled machine.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-[#0a0a0a] border-4 border-zinc-800 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-zinc-700 font-mono text-xs">
              CONVEX/SCHEMA.ts
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="text-zinc-500">{`// Unified Status System`}</div>
              <div className="text-violet-400">
                type Status = &quot;idle&quot; | &quot;active&quot; |
                &quot;completed&quot;;
              </div>
              <div className="text-zinc-500 mt-2">{`// Notes`}</div>
              <div className="text-zinc-500">defineTable({`{`}</div>
              <div className="text-zinc-400 pl-4">
                ownerId: v.id(&quot;users&quot;),
              </div>
              <div className="text-zinc-400 pl-4">title: v.string(),</div>
              <div className="text-zinc-400 pl-4">text: v.string(),</div>
              <div className="text-fuchsia-400 pl-4">status: Status,</div>
              <div className="text-zinc-400 pl-4">
                tags: v.optional(v.array(v.string())),
              </div>
              <div className="text-orange-400 pl-4">
                parentTaskId: v.optional(v.id(&quot;tasks&quot;)),
              </div>
              <div className="text-zinc-400 pl-4">createdAt: v.number(),</div>
              <div className="text-zinc-500">{"})"}</div>
              <div className="text-zinc-500 mt-2">{`// Tasks`}</div>
              <div className="text-zinc-500">defineTable({"{"}</div>
              <div className="text-zinc-400 pl-4">
                ownerId: v.id(&quot;users&quot;),
              </div>
              <div className="text-zinc-400 pl-4">title: v.string(),</div>
              <div className="text-fuchsia-400 pl-4">status: Status,</div>
              <div className="text-orange-400 pl-4">
                linkedNoteIds: v.array(v.id(&quot;notes&quot;)),
              </div>
              <div className="text-zinc-400 pl-4">
                aiProposals: v.optional(v.array(v.string())),
              </div>
              <div className="text-zinc-500">{"})"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Phase06() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-2">
          <span className="text-orange-500 text-opacity-40 font-black text-[12vw] leading-none">
            06
          </span>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-8">
            The Launch
          </h2>

          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed mb-12">
            <p>
              Three months from spark to launch. The landing page had to
              communicate the vision immediately: no more folders, pure
              metadata, relational tasks, AI-driven organization.
            </p>

            <p>
              The messaging focused on the paradigm shift. &quot;Controlled
              Chaos&quot; became the tagline. The brutal, aggressive design told
              the story: this is not your mother&apos;s productivity app. This
              is the future of knowledge work.
            </p>

            <p>
              Technical polish included GDPR compliance, soft-delete workflows,
              data export functionality, and comprehensive privacy controls. The
              app was ready to handle real data, real workflows, real people.
            </p>
          </div>

          <blockquote className="border-l-[5px] border-orange-500 pl-6 py-4 bg-orange-500/5 border-r-2 border-t-2 border-b-2 border-zinc-800">
            <p className="text-xl font-bold text-zinc-100 italic leading-relaxed">
              &quot;The best documentation is not the README. It&apos;s the
              first experience using the product.&quot;
            </p>
          </blockquote>
        </div>

        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-[#0a0a0a] border-4 border-zinc-800 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-zinc-700 font-mono text-xs">
              LANDING/PAGE.tsx
            </div>
            <div className="space-y-4">
              <div className="p-4 border-2 border-zinc-800">
                <div className="text-white font-bold mb-2">
                  Controlled Chaos.
                </div>
                <div className="text-zinc-600 text-sm">
                  The singularity where fluid documentation, ruthless execution,
                  and reactive intelligence converge.
                </div>
              </div>
              <div className="p-4 border-2 border-violet-600 bg-violet-600/10">
                <div className="text-violet-400 font-bold mb-2">
                  NO MORE FOLDERS
                </div>
                <div className="text-zinc-600 text-sm">
                  Pure metadata. Spatial relations.
                </div>
              </div>
              <div className="p-4 border-2 border-fuchsia-600 bg-fuchsia-600/10">
                <div className="text-fuchsia-400 font-bold mb-2">
                  ACTIVATE YOUR IDEAS
                </div>
                <div className="text-zinc-600 text-sm">
                  Transform notes to tasks instantly.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-white text-black px-6 py-3 font-bold text-sm hover:bg-violet-600 hover:text-white transition-colors">
                  START NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatILearned() {
  const lessons = [
    {
      title: "Hierarchy is overrated",
      text: "Flat, metadata-driven organization works better for creative thinking.",
    },
    {
      title: "Real-time changes everything",
      text: "Instant synchronization creates a sense of aliveness in the app.",
    },
    {
      title: "Intentionality matters",
      text: "Every feature must justify its existence. No cruft, no compromise.",
    },
    {
      title: "Design is opinionated",
      text: "Strong visual philosophy makes products memorable and usable.",
    },
    {
      title: "AI is a multiplier",
      text: "Not a replacement, but an amplification of human intent.",
    },
    {
      title: "Build what breaks you",
      text: "The best products solve the creator&apos;s own pain points.",
    },
    {
      title: "Process is as important as product",
      text: "Documenting the journey creates a narrative that inspires.",
    },
    {
      title: "Less is not enough",
      text: "It&apos;s not about minimal features. It&apos;s about essential ones, perfectly executed.",
    },
  ];

  return (
    <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto border-t border-zinc-800">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase mb-6">
          What I Learned
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Eight insights from building QUID
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {lessons.map((lesson, i) => (
          <div
            key={i}
            className="border-2 border-zinc-800 p-6 bg-[#0a0a0a] hover:border-violet-600 transition-colors"
          >
            <h3 className="text-white font-bold mb-2">{lesson.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {lesson.text}
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-6">
        <p className="text-xl text-zinc-400 leading-relaxed">
          Building QUID was not just about creating a productivity tool. It was
          about reimagining how we capture, organize, and execute ideas. The
          journey taught me that the best software doesn&apos;t just solve
          problems—it changes how you think about them.
        </p>

        <blockquote className="border-l-[5px] border-zinc-500 pl-6 py-4 bg-zinc-900/50 text-left">
          <p className="text-lg font-bold text-zinc-100 italic leading-relaxed">
            &quot;Share your failures. Share your breakthroughs. Document the
            process. Others will learn, and you&apos;ll grow.&quot;
          </p>
        </blockquote>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="min-h-[60vh] bg-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.15),transparent_70%)] -z-10" />

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-600 to-transparent" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-8">
          <Star className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-6">
          Your Turn
        </h2>

        <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
          Stop waiting. Start building. Your ideas are potential energy waiting
          to be activated.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-violet-600 text-white font-black text-lg uppercase tracking-widest hover:bg-violet-700 transition-colors border-2 border-transparent shadow-[8px_8px_0_0_#fff]"
          >
            Try QUID Now
          </Link>
          <Link
            href="https://github.com/quid-notes"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent text-white font-black text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-colors border-2 border-zinc-700 hover:border-white"
          >
            View Source
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-600 to-transparent" />
    </section>
  );
}
