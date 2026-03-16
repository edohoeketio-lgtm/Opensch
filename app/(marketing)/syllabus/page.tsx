import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CURRICULUM_WEEKS } from "@/lib/content";
import { BookOpen, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import React from "react";
import Link from "next/link";
import { CTA } from "@/lib/constants";

export const metadata = {
    title: "Course Syllabus | OpenSch",
    description: "Detailed curriculum breakdown for the OpenSch AI-Native Product Builder Cohort.",
};

export default function SyllabusPage() {
    return (
        <main className="min-h-screen bg-background pb-32">
            <SectionWrapper>
                <div className="container-wide max-w-4xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="The Syllabus"
                            title={<>From idea to <span className="font-serif text-accent">shipped product</span></>}
                            subtitle="A comprehensive 4-week roadmap teaching you how to design, build, and deploy a real application using AI-native workflows."
                        />
                    </AnimatedSection>

                    <div className="mt-16 space-y-12 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute left-[27px] top-6 bottom-6 w-px bg-border/50 z-0" />

                        {CURRICULUM_WEEKS.map((week, index) => (
                            <AnimatedSection key={week.number} delay={index * 0.1}>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10">
                                    {/* Week Marker */}
                                    <div className="flex-shrink-0 flex md:flex-col items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-surface border border-border shadow-sm flex flex-col items-center justify-center text-center group-hover:border-accent/40 group-hover:shadow-[0_4px_20px_rgba(176,141,87,0.1)] transition-all">
                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted mb-0.5">Week</span>
                                            <span className="text-xl font-bold text-ink leading-none">{week.number}</span>
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 rounded-[2rem] bg-surface border border-border/60 p-6 md:p-8 hover:border-accent/30 transition-colors shadow-sm">
                                        <div className="mb-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest border border-accent/20">
                                                    {week.pillar}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-semibold text-ink mt-4 mb-3">{week.title}</h2>
                                            <p className="text-muted text-[15px] leading-relaxed">{week.goal}</p>
                                        </div>

                                        <div className="space-y-4">
                                            {week.modules.map((module, mIndex) => (
                                                <div key={mIndex} className="p-5 rounded-xl bg-background border border-border/40 hover:border-accent/20 transition-colors group">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h3 className="font-semibold text-ink text-sm flex items-center gap-2">
                                                            <BookOpen size={16} className="text-muted group-hover:text-accent transition-colors" />
                                                            {module.title}
                                                        </h3>
                                                        {module.instructor && (
                                                            <span className="text-[11px] font-medium text-muted bg-surface px-2 py-1 rounded-md border border-border/50 hidden sm:inline-block">
                                                                with {module.instructor}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <ul className="space-y-2 mt-2">
                                                        {module.lessons.map((lesson, lIndex) => (
                                                            <li key={lIndex} className="flex items-start gap-2.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 flex-shrink-0 group-hover:bg-accent/40 transition-colors" />
                                                                <span className="text-sm text-muted/90 group-hover:text-ink transition-colors">{lesson.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-1">Weekly Deliverable</p>
                                                <p className="text-sm font-medium text-ink flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-accent" />
                                                    {week.deliverable}
                                                </p>
                                            </div>
                                            <div className="hidden sm:block w-px h-8 bg-border/50" />
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-1">Live Session Theme</p>
                                                <p className="text-sm font-medium text-ink flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                                                    {week.liveTheme}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.6}>
                        <div className="mt-20 text-center flex flex-col items-center">
                            <h3 className="text-2xl font-semibold text-ink mb-4">Ready to start building?</h3>
                            <p className="text-muted text-center max-w-xl mx-auto mb-8">
                                Applications are reviewed on a rolling basis. Spots are strictly limited to ensure high-quality feedback.
                            </p>
                            <CTAButton href="/apply" size="large" icon>
                                {CTA.primary}
                            </CTAButton>
                        </div>
                    </AnimatedSection>
                </div>
            </SectionWrapper>
        </main>
    );
}
