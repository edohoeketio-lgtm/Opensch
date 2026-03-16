"use client";

import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { CTA } from "@/lib/constants";
import {
    Lightbulb,
    Hammer,
    Users,
    Target,
    BookOpen,
    Rocket,
} from "lucide-react";

// ===== About Hero =====
function AboutHero() {
    return (
        <SectionWrapper gradient>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            About
                        </span>
                        <h1 className="text-ink mb-6">
                            Built by a{" "}
                            <span className="font-serif gradient-text">builder</span>,
                            <br />
                            for builders
                        </h1>
                        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
                            OpenSch exists because learning to build shouldn&apos;t mean learning
                            alone. The best way to ship is with structure, feedback, and
                            a deadline.
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== The Instructors =====
function InstructorStory() {
    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 items-start">
                        <AnimatedSection>
                            <div className="relative w-40 h-40 md:w-full md:h-auto md:aspect-square mx-auto md:mx-0">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent via-accent-light to-accent-dark opacity-15 animate-pulse-glow" />
                                <div className="absolute inset-[3px] rounded-2xl bg-surface flex items-center justify-center overflow-hidden border border-accent/20">
                                    <Image
                                        src="/images/Maurice.png"
                                        alt="Maurice Edohoeket"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 160px, 200px"
                                        priority
                                    />
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.1}>
                            <div>
                                <h2 className="text-ink mb-5">The <span className="font-serif text-accent">instructors</span></h2>
                                <div className="space-y-4 text-muted text-[0.9375rem] leading-relaxed">
                                    <p>
                                        OpenSch was created by builders who spent years learning the hard way — 
                                        through scattered resources, trial and error, and too many unfinished projects. 
                                        The frustration of having great ideas but no clear process to bring them to life 
                                        is the reason this academy exists.
                                    </p>
                                    <p>
                                        Led by Maurice Edohoeket alongside two expert instructors, the vision is clear:
                                        build a structured program that teaches others the same workflow we use daily. Not
                                        theory-first. Not tool-worship. A practical, milestone-driven process that works.
                                    </p>
                                    <p className="italic border-l-2 border-accent/30 pl-5 text-ink/70">
                                        &ldquo;Our goal has always been the same — help people go from &lsquo;I
                                        have an idea&rsquo; to &lsquo;I shipped it&rsquo; in 4 weeks.
                                        With a real curriculum, real deadlines, and real support.&rdquo;
                                    </p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}


// ===== Why This Exists =====
function WhyThisExists() {
    const reasons = [
        {
            icon: Lightbulb,
            title: "Ideas deserve better than passive content",
            description:
                "Most learning paths teach skills in isolation. OpenSch teaches you to take a real idea through the full lifecycle — plan, design, build, ship.",
        },
        {
            icon: Hammer,
            title: "Building is the best way to learn",
            description:
                "You won't watch lessons and hope it sticks. Every week, you apply what you learn to your own project. Every deliverable moves it forward.",
        },
        {
            icon: Users,
            title: "Accountability changes outcomes",
            description:
                "A cohort-based format means deadlines, peers, live sessions, and feedback. You're not doing this alone, and that makes the difference.",
        },
    ];

    return (
        <SectionWrapper>
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="Why this exists"
                        title={<>The problem we <span className="font-serif text-accent">solve</span></>}
                    />
                </AnimatedSection>

                <AnimatedSection stagger staggerDelay={0.12}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {reasons.map((r, i) => (
                            <AnimatedItem key={i}>
                                <Card hover>
                                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5 transition-colors duration-300">
                                        <r.icon size={20} className="text-accent" />
                                    </div>
                                    <h4 className="font-semibold text-ink mb-2">{r.title}</h4>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {r.description}
                                    </p>
                                </Card>
                            </AnimatedItem>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </SectionWrapper>
    );
}

// ===== Teaching Philosophy =====
function Philosophy() {
    const principles = [
        {
            icon: Target,
            title: "Outcome over curriculum",
            description:
                "The curriculum exists to serve your project, not the other way around. Every lesson is designed to move your product closer to launch.",
        },
        {
            icon: BookOpen,
            title: "Structure breeds creativity",
            description:
                "Constraints and deadlines aren't the enemy of creativity — they're the conditions that produce the best work. The 4-week format is intentional.",
        },
        {
            icon: Rocket,
            title: "Shipping is the skill",
            description:
                "Anyone can start. The hard part is finishing. This cohort is designed to help you get across the finish line with a product you're proud of.",
        },
    ];

    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <AnimatedSection>
                    <SectionHeader
                        label="Philosophy"
                        title={<>How we think about <span className="font-serif text-accent">teaching</span></>}
                    />
                </AnimatedSection>

                <div className="max-w-2xl mx-auto space-y-8">
                    {principles.map((p, i) => (
                        <AnimatedSection key={i} delay={i * 0.1}>
                            <div className="flex items-start gap-5 group">
                                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                                    <p.icon size={20} className="text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-ink mb-1.5">{p.title}</h4>
                                    <p className="text-muted text-[0.9375rem] leading-relaxed">
                                        {p.description}
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

// ===== What to Expect =====
function WhatToExpect() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="What to expect"
                            title={<>The OpenSch <span className="font-serif text-accent">experience</span></>}
                        />
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <Card padding="large">
                            <div className="prose max-w-none">
                                <p>
                                    When you join an OpenSch cohort, you&apos;re joining a structured
                                    4-week experience designed to take you from idea to shipped product.
                                    Each week has a clear theme, clear deliverables, and clear
                                    expectations.
                                </p>
                                <p>
                                    You&apos;ll watch recorded lessons at your own pace, attend weekly live
                                    classes with the full cohort, submit deliverables that move your
                                    project forward, and get feedback that helps you iterate faster.
                                </p>
                                <p>
                                    Premium students get even closer support — weekly office hours,
                                    project critiques, portfolio polish, and priority access to the
                                    instructor. But regardless of your tier, the goal is the same:
                                    finish the cohort with a product you built, a process you
                                    understand, and the confidence to do it again.
                                </p>
                            </div>
                        </Card>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== About CTA =====
function AboutCTA() {
    return (
        <SectionWrapper background="deep" className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[25%] right-[12%] w-28 h-28 rounded-full bg-accent/5 blur-2xl animate-float" />
                <div className="absolute bottom-[15%] left-[10%] w-20 h-20 rounded-full bg-accent/8 blur-xl animate-float" style={{ animationDelay: "2s" }} />
            </div>
            <div className="container-wide relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <AnimatedSection>
                        <h2 className="text-white mb-5">
                            Ready to{" "}
                            <span className="font-serif text-accent-light">build?</span>
                        </h2>
                        <p className="text-deep-muted text-lg leading-relaxed mb-10">
                            If you&apos;re serious about turning your ideas into real products,
                            we&apos;d love to have you in the next cohort.
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
export default function AboutPage() {
    return (
        <>
            <AboutHero />
            <InstructorStory />
            <WhyThisExists />
            <Philosophy />
            <WhatToExpect />
            <AboutCTA />
        </>
    );
}
