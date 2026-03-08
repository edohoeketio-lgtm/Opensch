"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { PRICING, COHORT, CTA } from "@/lib/constants";
import { COMPARISON_FEATURES } from "@/lib/content";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

// ===== Pricing Hero =====
function PricingHero() {
    return (
        <SectionWrapper gradient>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            Pricing
                        </span>
                        <h1 className="text-ink mb-6">
                            Choose the level of{" "}
                            <span className="font-serif gradient-text">support</span>{" "}
                            that fits you
                        </h1>
                        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
                            Both tiers include the full 4-week curriculum, recorded lessons, live
                            classes, and a final project. The difference is in the feedback,
                            accountability, and personal support you receive.
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Tier Cards =====
function TierCards() {
    return (
        <SectionWrapper background="surface" padding="small">
            <div className="container-wide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Basic */}
                    <AnimatedSection delay={0.1}>
                        <Card padding="large" hover className="h-full flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                                Basic
                            </span>
                            <div className="mt-3 mb-2">
                                <span className="text-4xl font-bold text-ink">
                                    {PRICING.basic.price}
                                </span>
                            </div>
                            <p className="text-sm text-muted mb-4">per cohort</p>
                            <p className="text-muted text-[0.9375rem] leading-relaxed mb-6">
                                {PRICING.basic.description}
                            </p>
                            <div className="mt-auto pt-4">
                                <p className="text-sm text-muted mb-4">
                                    {PRICING.basic.seats} seats per cohort
                                </p>
                                <CTAButton href="/apply" className="w-full">
                                    Apply — Basic
                                </CTAButton>
                            </div>
                        </Card>
                    </AnimatedSection>

                    {/* Premium */}
                    <AnimatedSection delay={0.2}>
                        <Card
                            padding="large"
                            hover
                            glow
                            className="h-full flex flex-col relative"
                        >
                            <span className="absolute -top-3 right-6 bg-gradient-to-r from-accent to-accent-light text-white text-[0.6875rem] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(176,141,87,0.3)]">
                                Recommended
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                                Premium
                            </span>
                            <div className="mt-3 mb-2">
                                <span className="text-4xl font-bold text-ink">
                                    {PRICING.premium.price}
                                </span>
                            </div>
                            <p className="text-sm text-muted mb-4">per cohort</p>
                            <p className="text-muted text-[0.9375rem] leading-relaxed mb-6">
                                {PRICING.premium.description}
                            </p>
                            <div className="mt-auto pt-4">
                                <p className="text-sm text-muted mb-4">
                                    {PRICING.premium.seats} seats per cohort
                                </p>
                                <CTAButton href="/apply" className="w-full bg-accent hover:bg-accent-dark text-white">
                                    Apply — Premium
                                </CTAButton>
                            </div>
                        </Card>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Comparison Table =====
function ComparisonTable() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Comparison"
                            title={<>Full feature <span className="font-serif text-accent">breakdown</span></>}
                        />
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-border-strong">
                                        <th className="text-left text-sm font-semibold text-ink py-5 px-6 pr-4">
                                            Feature
                                        </th>
                                        <th className="text-center text-sm font-semibold text-ink py-5 px-4 w-28">
                                            Basic
                                        </th>
                                        <th className="text-center text-sm font-semibold text-accent py-5 px-6 w-28">
                                            Premium
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_FEATURES.map((row, i) => (
                                        <motion.tr
                                            key={i}
                                            className="border-b border-border last:border-b-0 hover:bg-background/50 transition-colors duration-200"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.05 * i }}
                                        >
                                            <td className="text-[0.9375rem] text-ink py-4 px-6 pr-4">
                                                {row.feature}
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                {row.basic === true ? (
                                                    <Check size={18} className="text-ink/60 mx-auto" />
                                                ) : row.basic === false ? (
                                                    <X size={18} className="text-border-strong mx-auto" />
                                                ) : (
                                                    <span className="text-sm text-ink">{row.basic}</span>
                                                )}
                                            </td>
                                            <td className="text-center py-4 px-6">
                                                {row.premium === true ? (
                                                    <Check size={18} className="text-accent mx-auto" />
                                                ) : row.premium === false ? (
                                                    <X size={18} className="text-border-strong mx-auto" />
                                                ) : (
                                                    <span className="text-sm text-accent font-medium">
                                                        {row.premium}
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Who Each Tier Is Best For =====
function TierGuidance() {
    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-3xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Which tier?"
                            title={<>Choose what fits how you <span className="font-serif text-accent">learn</span></>}
                        />
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatedSection delay={0.1}>
                            <Card padding="large" hover>
                                <h3 className="font-semibold text-ink mb-3">Basic is for you if…</h3>
                                <p className="text-muted text-[0.9375rem] leading-relaxed">
                                    {PRICING.basic.bestFor}
                                </p>
                            </Card>
                        </AnimatedSection>
                        <AnimatedSection delay={0.2}>
                            <Card padding="large" hover glow>
                                <h3 className="font-semibold text-accent mb-3">
                                    Premium is for you if…
                                </h3>
                                <p className="text-muted text-[0.9375rem] leading-relaxed">
                                    {PRICING.premium.bestFor}
                                </p>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Logistics =====
function Logistics() {
    const notes = [
        {
            question: "When is payment due?",
            answer:
                "Accepted students receive a payment link with a deadline. Your seat is only confirmed once payment has been received.",
        },
        {
            question: "Can seats sell out?",
            answer:
                "Yes. There are 20 Basic and 10 Premium seats per cohort. Once filled, remaining applicants are placed on the waitlist.",
        },
        {
            question: "Are recordings available?",
            answer:
                "All recorded lessons are available throughout the cohort. Live sessions are also recorded and shared afterward.",
        },
        {
            question: "Is live attendance required?",
            answer:
                "Strongly recommended. Live sessions are where you get real-time feedback and connect with the cohort. Recordings are provided if you miss one.",
        },
        {
            question: "Is there a refund policy?",
            answer:
                "Refund and transfer details will be shared with accepted students before payment. We want every student to feel confident before committing.",
        },
    ];

    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Details"
                            title={<>Payment and <span className="font-serif text-accent">logistics</span></>}
                        />
                    </AnimatedSection>

                    <div className="space-y-0">
                        {notes.map((note, i) => (
                            <AnimatedSection key={i} delay={i * 0.06}>
                                <div className="py-5 border-b border-border group hover:pl-3 transition-all duration-300 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent/0 group-hover:bg-accent transition-all duration-300 rounded-full" />
                                    <h4 className="font-medium text-ink text-[0.9375rem] mb-1.5 group-hover:text-accent transition-colors duration-300">
                                        {note.question}
                                    </h4>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {note.answer}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== CTA =====
function PricingCTA() {
    return (
        <SectionWrapper background="deep" className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[25%] right-[10%] w-32 h-32 rounded-full bg-accent/5 blur-2xl animate-float" />
                <div className="absolute bottom-[20%] left-[15%] w-24 h-24 rounded-full bg-accent/8 blur-xl animate-float" style={{ animationDelay: "2s" }} />
            </div>
            <div className="container-wide relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <AnimatedSection>
                        <h2 className="text-white mb-5">
                            Find the right{" "}
                            <span className="font-serif text-accent-light">fit</span>
                        </h2>
                        <p className="text-deep-muted text-lg leading-relaxed mb-10">
                            Both tiers include the full curriculum and a path to shipping your
                            product. Choose Premium if you want closer support — or start with
                            Basic and let the structure guide you.
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
export default function PricingPage() {
    return (
        <>
            <PricingHero />
            <TierCards />
            <ComparisonTable />
            <TierGuidance />
            <Logistics />
            <PricingCTA />
        </>
    );
}
