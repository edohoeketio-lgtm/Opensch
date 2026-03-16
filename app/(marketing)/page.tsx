"use client";

import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { ACADEMY, COHORT, PRICING, SCHEDULE, CTA } from "@/lib/constants";
import {
    PROOF_ITEMS,
    CURRICULUM_WEEKS,
    AUDIENCE_SEGMENTS,
    STUDENT_OUTCOMES,
    FAQ_DATA,
} from "@/lib/content";
import {
    Sparkles,
    Users,
    Target,
    BookOpen,
    Calendar,
    Clock,
    Award,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Presentation,
    MonitorPlay,
    Linkedin
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ===== HERO =====
function Hero() {
    return (
        <SectionWrapper background="default" gradient className="relative overflow-hidden">
            <div className="container-wide">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            Applications open for the next cohort
                        </span>
                    </AnimatedSection>

                    <AnimatedSection delay={0.15}>
                        <h1 className="text-ink mb-6">
                            Learn to design, build, and{" "}
                            <span className="font-serif gradient-text">ship</span>{" "}
                            real products with AI
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={0.3}>
                        <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
                            A premium 4-week cohort for students, designers, and early builders.
                            Go from idea to shipped product with structure, live feedback,
                            and AI-native workflows.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={0.45}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CTAButton href={COHORT.isSoldOut ? "#waitlist" : "/apply"} size="large" icon>
                                {COHORT.isSoldOut ? "Join the Waitlist" : CTA.primary}
                            </CTAButton>
                            <CTAButton href="/syllabus" variant="secondary" size="large">
                                {CTA.secondary}
                            </CTAButton>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.6} stagger staggerDelay={0.06}>
                        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted">
                            {PROOF_ITEMS.map((item, i) => (
                                <AnimatedItem key={i}>
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-accent" />
                                        {item.label}
                                    </span>
                                </AnimatedItem>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== CREDIBILITY STRIP =====
function CredibilityStrip() {
    const items = [
        { icon: BookOpen, label: "Structured curriculum", detail: "48 core sprints across 4 weeks" },
        { icon: Target, label: "Project-based", detail: "Build and ship a real product" },
        { icon: Users, label: "Capped cohorts", detail: "30 seats per cohort" },
        { icon: Sparkles, label: "AI-native workflows", detail: "Claude, Antigravity & Gemini Nano Banana" },
    ];

    return (
        <SectionWrapper background="surface" padding="small">
            <div className="container-wide">
                <AnimatedSection stagger staggerDelay={0.1}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item, i) => (
                            <AnimatedItem key={i} direction="scale">
                                <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-background/50 transition-colors duration-300">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                                        <item.icon size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink text-sm">{item.label}</p>
                                        <p className="text-muted text-sm mt-0.5">{item.detail}</p>
                                    </div>
                                </div>
                            </AnimatedItem>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== WHAT THE ACADEMY IS =====
function WhatItIs() {
    const points = [
        {
            icon: BookOpen,
            title: "Structured curriculum",
            description:
                "Four weeks of carefully designed modules, recorded sessions, and live classes that guide you from idea to shipped product.",
        },
        {
            icon: Target,
            title: "Practical, project-based learning",
            description:
                "Everything you learn is applied to your own product. Every deliverable moves your project forward.",
        },
        {
            icon: Users,
            title: "Live support and accountability",
            description:
                "Weekly live cohort classes, strict deliverable deadlines, studio access, and Premium office hours for closer feedback.",
        },
    ];

    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="The Academy"
                        title={<>A new way to learn <span className="font-serif text-accent">building</span></>}
                        subtitle="OpenSch is a cohort-based academy where you learn by doing. Not lectures. Not theory. You design, build, and ship a real product in 4 weeks — guided by a structured curriculum and supported by live feedback."
                    />
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {points.map((point, i) => (
                        <AnimatedSection key={i} delay={i * 0.12}>
                            <Card hover>
                                <div className="w-11 h-11 rounded-xl bg-background flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors duration-300">
                                    <point.icon size={20} className="text-accent" />
                                </div>
                                <h3 className="text-base font-semibold text-ink mb-2">
                                    {point.title}
                                </h3>
                                <p className="text-muted text-[0.9375rem] leading-relaxed">
                                    {point.description}
                                </p>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== WHO IT IS FOR =====
function WhoItsFor() {
    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="Who it's for"
                        title={<>Built for builders at the <span className="font-serif text-accent">start</span></>}
                        subtitle="Whether you're a student, a designer, or someone with an idea that needs structure — this cohort gives you the tools, guidance, and accountability to actually ship."
                    />
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {AUDIENCE_SEGMENTS.map((segment, i) => (
                        <AnimatedSection key={i} delay={i * 0.1}>
                            <div className="p-6 border border-border rounded-2xl hover:border-accent/30 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent/0 group-hover:bg-accent transition-all duration-500" />
                                <h3 className="font-semibold text-ink mb-2 pl-1">{segment.title}</h3>
                                <p className="text-muted text-[0.9375rem] leading-relaxed pl-1">
                                    {segment.description}
                                </p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== WHAT STUDENTS LEAVE WITH =====
function Outcomes() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="Outcomes"
                        title={<>What you <span className="font-serif text-accent">leave</span> with</>}
                        subtitle="This isn't about watching passive content. It's about walking away with real, tangible results you can show."
                    />
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {STUDENT_OUTCOMES.map((outcome, i) => (
                        <AnimatedSection key={i} delay={i * 0.08}>
                            <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-surface transition-colors duration-300">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 300 }}
                                >
                                    <CheckCircle2
                                        size={20}
                                        className="text-accent flex-shrink-0 mt-0.5"
                                    />
                                </motion.div>
                                <div>
                                    <h4 className="font-semibold text-ink text-[0.9375rem] mb-1">
                                        {outcome.title}
                                    </h4>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {outcome.description}
                                    </p>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== CURRICULUM OVERVIEW =====
function CurriculumOverview() {
    const pillars = CURRICULUM_WEEKS.map((w) => ({
        number: w.number,
        pillar: w.pillar,
        title: w.title,
        goal: w.goal,
        deliverable: w.deliverable,
    }));

    return (
        <SectionWrapper background="deep" className="relative">
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        light
                        label="Curriculum"
                        title={<>4 weeks. One clear <span className="font-serif text-accent-light">arc</span>.</>}
                        subtitle="From thinking through your idea to shipping a finished product — each week builds on the last."
                    />
                </AnimatedSection>

                {/* Connecting line behind cards */}
                <div className="relative">
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {pillars.map((week, i) => (
                            <AnimatedSection key={i} delay={i * 0.15}>
                                <div className="p-6 md:p-8 rounded-2xl bg-deep-surface border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 group h-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold">
                                            {week.number}
                                        </span>
                                        <span className="text-accent text-xs font-semibold uppercase tracking-[0.15em]">
                                            Week {week.number}
                                        </span>
                                    </div>
                                    <h3 className="text-white text-lg font-semibold mt-2 mb-3">
                                        {week.pillar}
                                    </h3>
                                    <p className="text-deep-muted text-sm leading-relaxed mb-4">
                                        {week.goal}
                                    </p>
                                    <div className="pt-4 border-t border-white/[0.08]">
                                        <p className="text-xs text-deep-muted uppercase tracking-wider">
                                            Deliverable
                                        </p>
                                        <p className="text-white text-sm font-medium mt-1">
                                            {week.deliverable}
                                        </p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>

                <AnimatedSection delay={0.6}>
                    <div className="mt-12 text-center">
                        <CTAButton href="/syllabus" variant="dark" icon>
                            See full curriculum
                        </CTAButton>
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== HOW THE COHORT WORKS =====
function HowItWorks() {
    const items = [
        {
            icon: Calendar,
            title: "Sprints unlock every Monday",
            description:
                "Each week, all 12 recorded sessions unlock at once. Watch in the recommended order or on your own schedule throughout the week.",
        },
        {
            icon: Users,
            title: "Live class every Thursday",
            description:
                "Join the full cohort for a live session at 6:00 PM. Get feedback, see other students' work, and get clarity on the week's challenges.",
        },
        {
            icon: Target,
            title: "Deliverable due every Saturday",
            description:
                "Each week has a focused deliverable that moves your project forward. Submit by Saturday at 12:00 PM.",
        },
        {
            icon: Sparkles,
            title: "Premium office hours on Saturday",
            description:
                "Premium students get a weekly small-group session at 4:00 PM for direct feedback, critique, and closer support.",
        },
        {
            icon: Clock,
            title: "4–7 hours per week",
            description:
                "A focused commitment. Basic students spend about 4–6 hours, Premium students about 5–7 hours including office hours.",
        },
        {
            icon: Award,
            title: "Milestone-based progress",
            description:
                "Each week has a clear deliverable. By Week 4, you have a finished product and a case study to show.",
        },
    ];

    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="How it works"
                        title={<>A rhythm designed for <span className="font-serif text-accent">shipping</span></>}
                        subtitle="Every week has the same structure: learn, apply, get feedback, iterate. Clear cadence. Clear deliverables. No ambiguity."
                    />
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <AnimatedSection key={i} delay={i * 0.08}>
                            <Card hover>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                                        <item.icon size={16} className="text-accent" />
                                    </div>
                                    <span className="text-xs font-bold text-muted/40 uppercase tracking-wider">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-ink text-[0.9375rem] mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-muted text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== DEMO DAY OUTCOME =====
function DemoDayOutcome() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <div className="relative max-w-5xl mx-auto rounded-3xl p-8 md:p-14 overflow-hidden border border-accent/20 bg-deep-surface">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50 pointer-events-none" />
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                    The Grand Finale
                                </span>
                                <h3 className="text-3xl md:text-4xl font-semibold text-white mb-5 leading-tight">
                                    Demo Day: <span className="font-serif italic text-accent">Pitch & Present</span>
                                </h3>
                                <p className="text-deep-muted text-lg leading-relaxed mb-8">
                                    In Week 4, you don't just ship a product quietly. You present it. Our live Demo Day allows you to showcase your build, your architecture, and your portfolio case study to peers, potential investors, and the OpenSch network.
                                </p>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <MonitorPlay size={16} className="text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Live Product Demo</h4>
                                            <p className="text-sm text-deep-muted">Command the stage (virtually) and run through your shipped application live.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <Presentation size={16} className="text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Architecture & AI Breakdown</h4>
                                            <p className="text-sm text-deep-muted">Show us the stack, the AI tools you leveraged, and how you solved edge cases.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Loom-style UI mock container */}
                            <div className="relative w-full aspect-square sm:aspect-video lg:h-full min-h-[320px] rounded-2xl bg-[#0F1115] border border-white/10 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col z-10 group">
                                
                                {/* Top Browser/App Bar */}
                                <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2 shrink-0 rounded-t-2xl">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
                                    </div>
                                    <div className="mx-auto flex items-center justify-center w-1/3 max-w-[200px] h-5 bg-black/40 rounded-md border border-white/5">
                                        <div className="w-1/2 h-1.5 bg-white/20 rounded-full" />
                                    </div>
                                </div>

                                {/* Main Dashboard Layout */}
                                <div className="flex flex-1 overflow-hidden relative rounded-b-2xl bg-gradient-to-br from-black/20 to-black/40 z-10">
                                    {/* Sidebar */}
                                    <div className="w-1/4 max-w-[100px] border-r border-white/5 bg-white/[0.02] p-4 flex flex-col gap-4 shrink-0 hidden sm:flex z-10">
                                        <div className="w-full h-8 bg-accent/20 rounded-lg border border-accent/20 mb-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
                                        <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                                        <div className="w-full h-2 bg-white/10 rounded-full" />
                                        <div className="w-5/6 h-2 bg-white/10 rounded-full" />
                                        <div className="w-full h-2 bg-white/10 rounded-full" />
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex-1 p-5 sm:p-6 relative flex flex-col gap-6 z-10">
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3 w-1/2">
                                                <div className="w-1/3 h-2 bg-accent/40 rounded-full" />
                                                <div className="w-3/4 h-6 bg-white/20 rounded-lg" />
                                            </div>
                                            <div className="w-24 h-8 bg-white/10 rounded-lg border border-white/5" />
                                        </div>

                                        {/* Content Skeleton */}
                                        <div className="flex-1 bg-black/20 rounded-xl border border-white/5 p-4 sm:p-5 flex flex-col gap-4 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-2xl rounded-full pointer-events-none" />
                                            
                                            {/* Code/Data rows */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded bg-accent/20 shrink-0" />
                                                    <div className="w-1/3 h-2 bg-white/10 rounded-full shrink-0" />
                                                    <div className="flex-1 border-b border-dashed border-white/10" />
                                                    <div className="w-12 h-2 bg-accent/40 rounded-full shrink-0" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded bg-white/5 shrink-0" />
                                                    <div className="w-1/2 h-2 bg-white/10 rounded-full shrink-0" />
                                                    <div className="flex-1 border-b border-dashed border-white/10" />
                                                    <div className="w-8 h-2 bg-white/20 rounded-full shrink-0" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded bg-white/5 shrink-0" />
                                                    <div className="w-2/5 h-2 bg-white/10 rounded-full shrink-0" />
                                                    <div className="flex-1 border-b border-dashed border-white/10" />
                                                    <div className="w-16 h-2 bg-white/20 rounded-full shrink-0" />
                                                </div>
                                            </div>

                                            {/* Chart/Graph Area */}
                                            <div className="flex-1 mt-2 border-t border-white/5 pt-4 flex items-end gap-2 sm:gap-3">
                                                <div className="flex-1 h-1/3 bg-white/5 rounded-t-sm transition-all duration-700 group-hover:h-1/2" />
                                                <div className="flex-1 h-2/3 bg-white/10 rounded-t-sm transition-all duration-700 delay-75 group-hover:h-3/4" />
                                                <div className="flex-1 h-1/2 bg-accent/20 rounded-t-sm transition-all duration-700 delay-150 group-hover:h-full border-t border-accent/40 shadow-[0_-10px_20px_rgba(176,141,87,0.1)] relative">
                                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_rgba(176,141,87,1)]" />
                                                </div>
                                                <div className="flex-1 h-4/5 bg-white/10 rounded-t-sm transition-all duration-700 delay-200 group-hover:h-2/3" />
                                                <div className="flex-1 h-2/5 bg-white/5 rounded-t-sm transition-all duration-700 delay-300 group-hover:h-1/3 hidden xs:block" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Loom Camera Bubble Overlay - Breaking out of the container bounds */}
                                <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black shadow-[0_16px_32px_-8px_rgba(0,0,0,0.15)] border-[4px] border-[#0F1115] p-0.5 flex items-center justify-center z-30 group-hover:scale-105 transition-transform duration-500">
                                    <div className="relative w-full h-full rounded-full overflow-hidden bg-accent/10">
                                        <Image 
                                            src="/images/nigerian_presenter_demo.png" 
                                            alt="Presenter" 
                                            fill 
                                            className="object-cover opacity-90"
                                            style={{ objectPosition: 'center 20%' }}
                                            sizes="120px"
                                        />
                                        <div className="absolute inset-0 rounded-full border border-white/10 mix-blend-overlay" />
                                    </div>
                                    
                                    {/* Recording indicator ring */}
                                    <div className="absolute inset-0 rounded-full border-[2px] border-accent/60 animate-[spin_4s_linear_infinite] border-t-transparent group-hover:border-accent" />
                                </div>

                                {/* Loom Controls Bubble Overlay */}
                                <div className="absolute -bottom-3 left-20 sm:-bottom-4 sm:left-24 h-11 sm:h-12 bg-[#1A1A1A] border border-white/10 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.15)] rounded-full flex items-center px-4 sm:px-5 gap-3 sm:gap-4 z-30 group-hover:-translate-y-1 transition-transform duration-500">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 bg-[#FF453A] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,69,58,0.8)]" />
                                        <span className="text-white text-xs sm:text-sm font-mono font-medium tracking-wider pt-0.5">04:23</span>
                                    </div>
                                    <div className="w-px h-5 bg-white/10" />
                                    <div className="flex gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="w-2 h-2 rounded-[2px] bg-white/80" /> {/* Stop icon mock */}
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="flex gap-0.5">
                                                <div className="w-0.5 h-2.5 bg-white/80 rounded-full" />
                                                <div className="w-0.5 h-2.5 bg-white/80 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== TIER TEASER =====
function TierTeaser() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="Two paths"
                        title={<>Choose your level of <span className="font-serif text-accent">support</span></>}
                        subtitle="Both tiers include the full 4-week curriculum. The difference is in the feedback, accountability, and personal support."
                    />
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
                    {/* Basic */}
                    <AnimatedSection delay={0.1} className="h-full">
                        <div className="h-full flex flex-col p-8 rounded-[2rem] bg-surface border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">
                                Basic
                            </span>
                            <div className="mb-4">
                                <span className="text-4xl lg:text-5xl font-semibold tracking-tight text-ink">
                                    {PRICING.basic.price}
                                </span>
                            </div>
                            <p className="text-muted text-[1.0625rem] leading-relaxed mb-10">
                                {PRICING.basic.tagline}
                            </p>
                            <div className="mt-auto">
                                <div className="h-px w-full bg-border/50 mb-6" />
                                <p className="text-sm font-medium text-muted/80 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-muted/30" />
                                    {PRICING.basic.seats} seats per cohort
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Premium */}
                    <AnimatedSection delay={0.2} className="h-full">
                        <div className="relative h-full flex flex-col p-8 rounded-[2rem] bg-surface border-2 border-accent/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                            {/* Inner ambient glow for premium feel */}
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                                        Premium
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[0.625rem] font-bold uppercase tracking-widest border border-accent/20">
                                        Recommended
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <span className="text-4xl lg:text-5xl font-semibold tracking-tight text-ink">
                                        {PRICING.premium.price}
                                    </span>
                                </div>
                                <p className="text-muted text-[1.0625rem] leading-relaxed mb-10">
                                    {PRICING.premium.tagline}
                                </p>
                                <div className="mt-auto">
                                    <div className="h-px w-full bg-border/50 mb-6" />
                                    <p className="text-sm font-medium text-muted/80 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                                        {PRICING.premium.seats} seats per cohort
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>

                <AnimatedSection delay={0.3}>
                    <div className="mt-10 text-center">
                        <CTAButton href="/pricing" variant="secondary" icon>
                            Compare plans in detail
                        </CTAButton>
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== DATES & SEAT CAP =====
function DatesAndSeats() {
    const details = [
        { label: "Applications open", value: COHORT.dates.applicationsOpen },
        { label: "Applications close", value: COHORT.dates.applicationsClose },
        { label: "Cohort starts", value: COHORT.dates.cohortStart },
        { label: "Total seats", value: `${COHORT.totalSeats} (${COHORT.basicSeats} Basic / ${COHORT.premiumSeats} Premium)` },
        { label: "Admission", value: "Application-based" },
    ];

    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Key dates"
                            title={<>Next cohort <span className="font-serif text-accent">timeline</span></>}
                            subtitle="Seats are strictly limited to ensure high-quality feedback. Applications are reviewed on a rolling basis."
                        />
                    </AnimatedSection>
                    
                    <AnimatedSection delay={0.05}>
                        <div className="flex items-center justify-center mb-8">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                                </span>
                                <span className="text-sm font-semibold text-accent">
                                    {COHORT.isSoldOut ? "Cohort sold out. Join waitlist below." : `Only ${COHORT.totalSeats} seats available for ${COHORT.dates.cohortStart}`}
                                </span>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <Card padding="large">
                            <div className="space-y-0">
                                {details.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15 + i * 0.08 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border last:border-b-0"
                                    >
                                        <span className="text-muted text-sm font-medium">
                                            {item.label}
                                        </span>
                                        <span className="text-ink font-medium text-[0.9375rem] mt-1 sm:mt-0">
                                            {item.value}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </AnimatedSection>

                    <AnimatedSection delay={0.3}>
                        <div className="mt-10 text-center">
                            <CTAButton href={COHORT.isSoldOut ? "#waitlist" : "/apply"} icon>
                                {COHORT.isSoldOut ? "Join the Waitlist" : CTA.primary}
                            </CTAButton>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== INSTRUCTORS CREDIBILITY =====
const INSTRUCTORS = [
    {
        name: "Maurice Edohoeket",
        role: "Lead Instructor",
        bio: "Builder and designer with years of experience transforming ideas into shipped products. Obsessed with practical execution over theory.",
        image: "/images/Maurice.png",
        linkedin: "https://www.linkedin.com/in/iedohoeket/",
    },
    {
        name: "Instructor",
        role: "Technical Lead",
        bio: "Senior engineer focusing on scalable system architecture and helping you build robust backends that don't fall over.",
        image: null,
        initial: "T",
        linkedin: "https://linkedin.com/",
    },
    {
        name: "Instructor",
        role: "Growth & Product",
        bio: "Product strategist dedicated to making sure the things you build actually solve real problems and reach the right people.",
        image: null,
        initial: "G",
        linkedin: "https://linkedin.com/",
    }
];

function InstructorsCredibility() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="The instructors"
                        title={<>Learn from <span className="font-serif text-accent">builders</span></>}
                        subtitle="We don't just teach theory. We build, ship, and scale products every day."
                    />
                </AnimatedSection>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {INSTRUCTORS.map((instructor, i) => (
                        <AnimatedSection key={i} delay={i * 0.1} className="h-full">
                            <Card hover className="h-full flex flex-col text-center items-center">
                                <div className="relative w-28 h-28 mx-auto mb-6 group">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-accent-light to-accent-dark opacity-10 group-hover:opacity-40 transition-opacity duration-500 animate-pulse-glow" />
                                    <div className="absolute inset-[3px] rounded-full bg-deep-surface flex items-center justify-center overflow-hidden border-2 border-accent/20 group-hover:border-accent/50 transition-colors duration-500">
                                        {instructor.image ? (
                                            <Image
                                                src={instructor.image}
                                                alt={instructor.name}
                                                fill
                                                className="object-cover"
                                                sizes="112px"
                                                priority={i === 0}
                                            />
                                        ) : (
                                            <span className="text-accent text-4xl font-serif">{instructor.initial}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <h3 className="text-ink font-semibold text-xl mb-1">{instructor.name}</h3>
                                <p className="text-accent text-xs uppercase tracking-[0.15em] font-semibold mb-5">{instructor.role}</p>
                                
                                <p className="text-muted text-[0.9375rem] leading-relaxed flex-grow mb-8 px-4">
                                    {instructor.bio}
                                </p>

                                <a 
                                    href={instructor.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent transition-colors duration-300"
                                >
                                    <Linkedin size={18} />
                                    <span>Connect on LinkedIn</span>
                                </a>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== FAQ PREVIEW =====
function FAQPreview() {
    const previewQuestions = [
        FAQ_DATA[0].questions[0],
        FAQ_DATA[0].questions[1],
        FAQ_DATA[1].questions[0],
        FAQ_DATA[3].questions[0],
        FAQ_DATA[4].questions[0],
    ];

    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Questions"
                            title={<>Common <span className="font-serif text-accent">questions</span></>}
                        />
                    </AnimatedSection>

                    <div className="space-y-0">
                        {previewQuestions.map((q, i) => (
                            <AnimatedSection key={i} delay={i * 0.06}>
                                <div className="py-5 border-b border-border group hover:pl-3 transition-all duration-300 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent/0 group-hover:bg-accent transition-all duration-300 rounded-full" />
                                    <h4 className="font-medium text-ink text-[0.9375rem] mb-2 group-hover:text-accent transition-colors duration-300">
                                        {q.question}
                                    </h4>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {q.answer}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.4}>
                        <div className="mt-10 text-center">
                            <CTAButton href="/faq" variant="secondary" icon>
                                See all questions
                            </CTAButton>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== LEAD MAGNET =====
function LeadMagnet() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <div className="max-w-4xl mx-auto bg-deep-surface rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden">
                        {/* Decorative background effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">
                                    Not ready to apply yet?
                                </h3>
                                <p className="text-deep-muted text-[0.9375rem] leading-relaxed mb-6">
                                    Get the complete 4-week syllabus sent to your inbox. See exactly what we cover, the AI workflows we teach, and the milestones you'll hit.
                                </p>
                                {/* Simple Netlify/Vercel compliant form or mailto for now */}
                                <form id="waitlist" className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert("Thanks! Check your inbox shortly."); }}>
                                    <label htmlFor="syllabus-email" className="sr-only">Email Address</label>
                                    <input 
                                        id="syllabus-email"
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required
                                        className="flex-1 px-4 py-3 rounded-xl bg-background/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
                                    />
                                    <CTAButton type="submit" variant="primary" className="whitespace-nowrap">
                                        Get Syllabus
                                    </CTAButton>
                                </form>
                                <p className="text-xs text-deep-muted mt-3">No spam. Unsubscribe anytime.</p>
                            </div>
                            
                            <div className="hidden md:flex justify-end">
                                <div className="w-48 h-64 bg-background rounded-xl border border-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] p-5 relative transform rotate-3 hover:rotate-6 transition-transform duration-500">
                                    <div className="w-1/3 h-2 bg-accent/60 rounded-full mb-6" />
                                    
                                    <div className="space-y-4">
                                        {/* Week 1 */}
                                        <div>
                                            <div className="w-1/4 h-1.5 bg-ink/20 rounded-full mb-2" />
                                            <div className="space-y-1.5 pl-2 border-l-2 border-accent/20">
                                                <div className="w-full h-1 bg-ink/10 rounded-full" />
                                                <div className="w-5/6 h-1 bg-ink/10 rounded-full" />
                                                <div className="w-4/6 h-1 bg-ink/10 rounded-full" />
                                            </div>
                                        </div>

                                        {/* Week 2 */}
                                        <div>
                                            <div className="w-1/4 h-1.5 bg-ink/20 rounded-full mb-2" />
                                            <div className="space-y-1.5 pl-2 border-l-2 border-accent/20">
                                                <div className="w-full h-1 bg-ink/10 rounded-full" />
                                                <div className="w-5/6 h-1 bg-ink/10 rounded-full" />
                                            </div>
                                        </div>
                                        
                                        {/* Week 3 */}
                                        <div>
                                            <div className="w-1/4 h-1.5 bg-ink/20 rounded-full mb-2" />
                                            <div className="space-y-1.5 pl-2 border-l-2 border-accent/20">
                                                <div className="w-full h-1 bg-ink/10 rounded-full" />
                                                <div className="w-3/4 h-1 bg-ink/10 rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20 shadow-sm">
                                        <ChevronRight size={14} className="text-accent ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== FINAL CTA =====
function FinalCTA() {
    return (
        <SectionWrapper background="deep" className="relative overflow-hidden">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full bg-accent/5 blur-2xl animate-float" />
                <div className="absolute bottom-[15%] left-[8%] w-24 h-24 rounded-full bg-accent/8 blur-xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute top-[50%] left-[50%] w-40 h-40 rounded-full bg-accent/3 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
            </div>

            <div className="container-wide relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            Ready to start?
                        </span>
                        <h2 className="text-white mb-5">
                            The next cohort is{" "}
                            <span className="font-serif text-accent-light">open</span>
                        </h2>
                        <p className="text-deep-muted text-lg leading-relaxed mb-10">
                            Seats are limited. Applications are reviewed within 2–3 days.
                            If you&apos;re serious about building and shipping, we&apos;d love to have
                            you in.
                        </p>
                        <CTAButton href={COHORT.isSoldOut ? "#waitlist" : "/apply"} variant="dark" size="large" icon>
                            {COHORT.isSoldOut ? "Join the Waitlist" : CTA.primary}
                        </CTAButton>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== HOME PAGE =====
export default function HomePage() {
    return (
        <>
            <Hero />
            <CredibilityStrip />
            <WhatItIs />
            <WhoItsFor />
            <Outcomes />
            <CurriculumOverview />
            <LeadMagnet />
            <HowItWorks />
            <DemoDayOutcome />
            <TierTeaser />
            <DatesAndSeats />
            <InstructorsCredibility />
            <FAQPreview />
            <FinalCTA />
        </>
    );
}
