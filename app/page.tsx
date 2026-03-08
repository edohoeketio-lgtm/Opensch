"use client";

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
                            <CTAButton href="/apply" size="large" icon>
                                {CTA.primary}
                            </CTAButton>
                            <CTAButton href="/curriculum" variant="secondary" size="large">
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
        { icon: BookOpen, label: "Structured curriculum", detail: "48 lessons across 4 weeks" },
        { icon: Target, label: "Project-based", detail: "Build and ship a real product" },
        { icon: Users, label: "Capped cohorts", detail: "30 seats per cohort" },
        { icon: Sparkles, label: "AI-native workflows", detail: "Modern tools and methods" },
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
                "Four weeks of carefully designed modules, recorded lessons, and live classes that guide you from idea to shipped product.",
        },
        {
            icon: Target,
            title: "Practical, project-based learning",
            description:
                "Everything you learn is applied to your own product. Every assignment moves your project forward.",
        },
        {
            icon: Users,
            title: "Live support and accountability",
            description:
                "Weekly live cohort classes, assignments with deadlines, community access, and Premium office hours for closer feedback.",
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
                        subtitle="This isn't about watching lessons. It's about walking away with real, tangible results you can show."
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
                        <CTAButton href="/curriculum" variant="dark" icon>
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
            title: "Lessons unlock every Monday",
            description:
                "Each week, all 12 recorded lessons unlock at once. Watch in the recommended order or on your own schedule throughout the week.",
        },
        {
            icon: Users,
            title: "Live class every Thursday",
            description:
                "Join the full cohort for a live session at 6:00 PM. Get feedback, see other students' work, and get clarity on the week's challenges.",
        },
        {
            icon: Target,
            title: "Assignment due every Saturday",
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Basic */}
                    <AnimatedSection delay={0.1}>
                        <Card hover padding="large">
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                                Basic
                            </span>
                            <div className="mt-3 mb-4">
                                <span className="text-3xl font-bold text-ink">
                                    {PRICING.basic.price}
                                </span>
                            </div>
                            <p className="text-muted text-[0.9375rem] leading-relaxed mb-5">
                                {PRICING.basic.tagline}
                            </p>
                            <p className="text-sm text-muted">
                                {PRICING.basic.seats} seats per cohort
                            </p>
                        </Card>
                    </AnimatedSection>

                    {/* Premium */}
                    <AnimatedSection delay={0.2}>
                        <Card
                            hover
                            glow
                            padding="large"
                            className="relative"
                        >
                            <span className="absolute -top-3 right-6 bg-gradient-to-r from-accent to-accent-light text-white text-[0.6875rem] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(176,141,87,0.3)]">
                                Recommended
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                                Premium
                            </span>
                            <div className="mt-3 mb-4">
                                <span className="text-3xl font-bold text-ink">
                                    {PRICING.premium.price}
                                </span>
                            </div>
                            <p className="text-muted text-[0.9375rem] leading-relaxed mb-5">
                                {PRICING.premium.tagline}
                            </p>
                            <p className="text-sm text-muted">
                                {PRICING.premium.seats} seats per cohort
                            </p>
                        </Card>
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
                            subtitle="Seats are limited. Applications are reviewed for fit."
                        />
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
                            <CTAButton href="/apply" icon>
                                {CTA.primary}
                            </CTAButton>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== FOUNDER CREDIBILITY =====
function FounderCredibility() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="The instructor"
                            title={<>Built by someone who <span className="font-serif text-accent">builds</span></>}
                        />
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <div className="text-center">
                            {/* Monogram with gradient ring */}
                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-accent-light to-accent-dark opacity-20 animate-pulse-glow" />
                                <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                                    <span className="text-accent text-3xl font-serif">S</span>
                                </div>
                                <div className="absolute inset-0 rounded-full border-2 border-accent/30" />
                            </div>

                            <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto mb-8 italic">
                                &ldquo;OpenSch was created by a builder who believes the best way to learn
                                is by doing — not by watching. The curriculum is shaped by
                                real experience designing, building, and shipping products.&rdquo;
                            </p>
                            <CTAButton href="/about" variant="secondary" icon>
                                Read the full story
                            </CTAButton>
                        </div>
                    </AnimatedSection>
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
                        <CTAButton href="/apply" variant="dark" size="large" icon>
                            {CTA.primary}
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
            <HowItWorks />
            <TierTeaser />
            <DatesAndSeats />
            <FounderCredibility />
            <FAQPreview />
            <FinalCTA />
        </>
    );
}
