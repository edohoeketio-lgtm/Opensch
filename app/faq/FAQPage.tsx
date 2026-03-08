"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FAQ_DATA } from "@/lib/content";
import { CTA } from "@/lib/constants";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// ===== FAQ Hero =====
function FAQHero() {
    return (
        <SectionWrapper gradient>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            FAQ
                        </span>
                        <h1 className="text-ink mb-6">
                            Frequently asked{" "}
                            <span className="font-serif gradient-text">questions</span>
                        </h1>
                        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
                            Everything you need to know about the cohort, curriculum, pricing,
                            admissions, and what to expect.
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Category Navigation =====
function CategoryNav({ categories, activeCategory, setActiveCategory }: {
    categories: string[];
    activeCategory: string | null;
    setActiveCategory: (cat: string | null) => void;
}) {
    return (
        <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${activeCategory === null
                            ? "bg-ink text-white"
                            : "bg-transparent text-muted hover:text-ink hover:bg-surface border border-border"
                        }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${activeCategory === cat
                                ? "bg-ink text-white"
                                : "bg-transparent text-muted hover:text-ink hover:bg-surface border border-border"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </AnimatedSection>
    );
}

// ===== FAQ Category Section =====
function FAQCategory({
    category,
    questions,
    delay = 0,
}: {
    category: string;
    questions: { question: string; answer: string }[];
    delay?: number;
}) {
    return (
        <AnimatedSection delay={delay}>
            <div className="mb-12 last:mb-0">
                <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-accent mb-5">
                    <span className="h-[1px] w-4 bg-accent/30" />
                    {category}
                </h3>
                <Accordion.Root type="multiple" className="w-full">
                    {questions.map((q, i) => (
                        <Accordion.Item key={i} value={`${category}-${i}`}>
                            <Accordion.Header>
                                <Accordion.Trigger className="accordion-trigger">
                                    <span>{q.question}</span>
                                    <ChevronDown size={16} className="accordion-chevron text-muted" />
                                </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content className="accordion-content">
                                <div className="pb-5 pr-8">
                                    <p className="text-muted text-[0.9375rem] leading-relaxed">
                                        {q.answer}
                                    </p>
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </div>
        </AnimatedSection>
    );
}

// ===== FAQ CTA =====
function FAQCTA() {
    return (
        <SectionWrapper background="deep" className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-28 h-28 rounded-full bg-accent/5 blur-2xl animate-float" />
                <div className="absolute bottom-[20%] left-[15%] w-20 h-20 rounded-full bg-accent/8 blur-xl animate-float" style={{ animationDelay: "3s" }} />
            </div>
            <div className="container-wide relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <AnimatedSection>
                        <h2 className="text-white mb-5">
                            Still have <span className="font-serif text-accent-light">questions</span>?
                        </h2>
                        <p className="text-deep-muted text-lg leading-relaxed mb-10">
                            If your question isn&apos;t answered here, reach out and we&apos;ll get back
                            to you.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CTAButton href="/apply" variant="dark" icon>
                                {CTA.primary}
                            </CTAButton>
                            <CTAButton
                                href="mailto:hello@opensch.com"
                                variant="secondary"
                                className="border-white/20 text-white hover:border-white/40 hover:text-white"
                            >
                                Contact us
                            </CTAButton>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== PAGE =====
export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const categories = FAQ_DATA.map((cat) => cat.category);
    const filteredData = activeCategory
        ? FAQ_DATA.filter((cat) => cat.category === activeCategory)
        : FAQ_DATA;

    return (
        <>
            <FAQHero />
            <SectionWrapper background="surface">
                <div className="container-wide">
                    <div className="max-w-2xl mx-auto">
                        <CategoryNav
                            categories={categories}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                        />
                        {filteredData.map((cat, i) => (
                            <FAQCategory
                                key={cat.category}
                                category={cat.category}
                                questions={cat.questions}
                                delay={i * 0.06}
                            />
                        ))}
                    </div>
                </div>
            </SectionWrapper>
            <FAQCTA />
        </>
    );
}
