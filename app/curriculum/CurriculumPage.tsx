"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { COHORT, PRICING, SCHEDULE, CTA } from "@/lib/constants";
import { CURRICULUM_WEEKS, LEARNING_OUTCOMES } from "@/lib/content";
import {
    BookOpen,
    Clock,
    Users,
    Award,
    CheckCircle2,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

// ===== Curriculum Hero =====
function CurriculumHero() {
    return (
        <SectionWrapper gradient>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            Curriculum
                        </span>
                        <h1 className="text-ink mb-6">
                            4 weeks from idea to{" "}
                            <span className="font-serif gradient-text">shipped product</span>
                        </h1>
                        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                            A structured, practical curriculum designed to take you from concept
                            to launch. Every week builds on the last. Every assignment moves your
                            project forward.
                        </p>
                        <CTAButton href="/apply" icon>
                            {CTA.primary}
                        </CTAButton>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== What Students Will Learn =====
function WhatYouLearn() {
    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="What you'll learn"
                        title={<>Skills that <span className="font-serif text-accent">compound</span></>}
                        subtitle="By the end of the cohort, you'll have practical experience across the full product lifecycle."
                    />
                </AnimatedSection>

                <AnimatedSection stagger staggerDelay={0.08}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {LEARNING_OUTCOMES.map((outcome, i) => (
                            <AnimatedItem key={i} direction="scale">
                                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-background/50 transition-colors duration-300">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 300 }}
                                    >
                                        <CheckCircle2 size={18} className="text-accent flex-shrink-0" />
                                    </motion.div>
                                    <span className="text-ink text-[0.9375rem] font-medium">
                                        {outcome}
                                    </span>
                                </div>
                            </AnimatedItem>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== Weekly Arc Overview =====
function WeeklyArc() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="The arc"
                        title={<>Think. Design. Build. <span className="font-serif text-accent">Ship.</span></>}
                        subtitle="Four weeks. Four distinct phases. One complete journey from idea to launched product."
                    />
                </AnimatedSection>

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-[52px] left-[40px] right-[40px] h-[1px] bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {CURRICULUM_WEEKS.map((week, i) => (
                                <AnimatedSection key={i} delay={i * 0.12}>
                                    <div className="text-center md:text-left">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent font-bold text-lg mb-5 relative">
                                            {week.number}
                                            <div className="absolute inset-0 rounded-2xl border border-accent/20" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-ink mb-2">
                                            {week.pillar}
                                        </h3>
                                        <p className="text-muted text-sm leading-relaxed">
                                            {week.goal}
                                        </p>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Full Week-by-Week Breakdown =====
function WeekBreakdown({ week, index }: { week: (typeof CURRICULUM_WEEKS)[0]; index: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="relative mb-8 last:mb-0">
            {/* Timeline dot and line */}
            <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-8 flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-accent/30 border-2 border-accent mt-10 z-10" />
                {index < 3 && <div className="flex-1 w-[1px] bg-border mt-1" />}
            </div>

            <div className="md:ml-12">
                <Card padding="large" hover>
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent font-bold text-xl">
                                {week.number}
                            </div>
                        </div>

                        <div className="flex-1">
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                                Week {week.number} — {week.pillar}
                            </span>
                            <h3 className="text-xl font-semibold text-ink mt-1 mb-2">
                                {week.title}
                            </h3>
                            <p className="text-muted text-[0.9375rem] leading-relaxed mb-4">
                                {week.goal}
                            </p>

                            <div className="space-y-4">
                                {week.modules.map((mod, mi) => (
                                    <div key={mi}>
                                        <h4 className="font-medium text-ink text-sm mb-2">
                                            Module {mi + 1}: {mod.title}
                                        </h4>
                                        <div
                                            className={`space-y-1 ${!expanded && mi >= 2 ? "hidden md:block" : ""}`}
                                        >
                                            {mod.lessons.map((lesson, li) => (
                                                <p key={li} className="text-muted text-sm pl-4 flex items-start gap-2">
                                                    <span className="text-accent/40 mt-1.5">•</span>
                                                    {lesson.title}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="md:hidden mt-3 text-accent text-sm font-medium flex items-center gap-1 hover:underline"
                            >
                                {expanded ? "Show less" : "Show all modules"}
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                                />
                            </button>

                            <div className="mt-6 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted uppercase tracking-wider mb-1">
                                        Weekly Deliverable
                                    </p>
                                    <p className="text-ink font-medium text-sm">
                                        {week.deliverable}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase tracking-wider mb-1">
                                        Live Class Theme
                                    </p>
                                    <p className="text-ink font-medium text-sm">
                                        {week.liveTheme}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function FullBreakdown() {
    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-4xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Week by week"
                            title={<>The full <span className="font-serif text-accent">breakdown</span></>}
                            subtitle="Every module, sample lesson, and weekly deliverable — so you know exactly what to expect."
                        />
                    </AnimatedSection>

                    {CURRICULUM_WEEKS.map((week, i) => (
                        <AnimatedSection key={i} delay={i * 0.1}>
                            <WeekBreakdown week={week} index={i} />
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Delivery Format =====
function DeliveryFormat() {
    const stats = [
        { value: "4", label: "Modules per week" },
        { value: "3", label: "Lessons per module" },
        { value: "12", label: "Lessons per week" },
        { value: "48", label: "Total lessons" },
        { value: "1", label: "Live class weekly" },
        { value: "1", label: "Assignment weekly" },
    ];

    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="Structure"
                        title={<>How content is <span className="font-serif text-accent">delivered</span></>}
                        subtitle="Everything is designed for focused, practical learning with clear weekly milestones."
                    />
                </AnimatedSection>

                <AnimatedSection stagger staggerDelay={0.08}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, i) => (
                            <AnimatedItem key={i} direction="scale">
                                <div className="text-center p-4 rounded-2xl hover:bg-surface transition-colors duration-300">
                                    <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                                    <p className="text-sm text-muted">{stat.label}</p>
                                </div>
                            </AnimatedItem>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== Time Commitment =====
function TimeCommitment() {
    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Commitment"
                            title={<>What to <span className="font-serif text-accent">expect</span></>}
                            subtitle="A realistic view of the weekly workload so you can plan accordingly."
                        />
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <Card padding="large">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0">
                                        <Clock size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-ink mb-1">
                                            Basic: {SCHEDULE.weeklyHours.basic} per week
                                        </h4>
                                        <p className="text-muted text-sm leading-relaxed">
                                            Includes recorded lessons, live cohort class, and weekly assignment.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                        <Clock size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-ink mb-1">
                                            Premium: {SCHEDULE.weeklyHours.premium} per week
                                        </h4>
                                        <p className="text-muted text-sm leading-relaxed">
                                            Everything in Basic plus weekly Premium office hours and additional feedback sessions.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-muted text-sm leading-relaxed">
                                        <strong className="text-ink">Certificate eligibility</strong> is based on
                                        assignment completion, live class participation, and final project
                                        submission. Specific thresholds will be shared at orientation.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Premium Note =====
function PremiumNote() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-2xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
                            <span className="h-[1px] w-6 bg-accent/30" />
                            Premium tier
                            <span className="h-[1px] w-6 bg-accent/30" />
                        </span>
                        <h3 className="text-ink mb-4">Want closer <span className="font-serif text-accent">support</span>?</h3>
                        <p className="text-muted text-lg leading-relaxed mb-8">
                            Premium students get weekly office hours, smaller feedback sessions,
                            project critiques, portfolio polish support, and priority access to the
                            instructor. If you want tighter accountability and direct feedback on
                            your work, Premium is designed for you.
                        </p>
                        <CTAButton href="/pricing" variant="secondary" icon>
                            See pricing and tiers
                        </CTAButton>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Curriculum CTA =====
function CurriculumCTA() {
    return (
        <SectionWrapper background="deep" className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[15%] w-32 h-32 rounded-full bg-accent/5 blur-2xl animate-float" />
                <div className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full bg-accent/8 blur-xl animate-float" style={{ animationDelay: "3s" }} />
            </div>
            <div className="container-wide relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <AnimatedSection>
                        <h2 className="text-white mb-5">
                            Ready to start{" "}
                            <span className="font-serif text-accent-light">building</span>?
                        </h2>
                        <p className="text-deep-muted text-lg leading-relaxed mb-10">
                            The curriculum is designed to get you from idea to shipped product in
                            4 weeks. Apply now to secure your seat.
                        </p>
                        <CTAButton href="/apply" variant="dark" size="large" icon>
                            {CTA.primary}
                        </CTAButton>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== PAGE =====
export default function CurriculumPage() {
    return (
        <>
            <CurriculumHero />
            <WhatYouLearn />
            <WeeklyArc />
            <FullBreakdown />
            <DeliveryFormat />
            <TimeCommitment />
            <PremiumNote />
            <CurriculumCTA />
        </>
    );
}
