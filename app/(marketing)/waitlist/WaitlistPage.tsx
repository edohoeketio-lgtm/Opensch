"use client";

import { useState, FormEvent } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { ACADEMY } from "@/lib/constants";
import { CheckCircle2, Bell, ArrowRight } from "lucide-react";

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        // Simulate submission
        setTimeout(() => setSubmitted(true), 800);
    };

    return (
        <>
            <SectionWrapper>
                <div className="container-wide">
                    <div className="max-w-xl mx-auto text-center">
                        {!submitted ? (
                            <AnimatedSection>
                                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                    <Bell size={24} className="text-accent" />
                                </div>

                                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-4">
                                    Applications closed
                                </span>

                                <h1 className="text-ink mb-4">
                                    The current cohort is{" "}
                                    <span className="font-serif text-accent">full</span>
                                </h1>

                                <p className="text-muted text-lg leading-relaxed mb-8">
                                    Applications for this cohort are now closed. Join the waitlist
                                    to be the first to know when the next cohort opens.
                                </p>

                                {/* Waitlist Form */}
                                <Card padding="large" className="text-left">
                                    <h3 className="font-semibold text-ink mb-1 text-center">
                                        Join the waitlist
                                    </h3>
                                    <p className="text-sm text-muted text-center mb-6">
                                        We&apos;ll notify you as soon as applications reopen.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="waitlist-name" className="form-label">
                                                Name
                                            </label>
                                            <input
                                                id="waitlist-name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your name"
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="waitlist-email" className="form-label">
                                                Email address <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                id="waitlist-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                placeholder="you@example.com"
                                                className={`form-input ${error ? "error" : ""}`}
                                            />
                                            {error && <p className="form-error">{error}</p>}
                                        </div>
                                        <CTAButton type="submit" className="w-full" icon>
                                            Join the waitlist
                                        </CTAButton>
                                    </form>
                                </Card>

                                {/* Academy reminder */}
                                <div className="mt-12 text-left">
                                    <h3 className="text-ink mb-3 text-center">
                                        What is {ACADEMY.name}?
                                    </h3>
                                    <p className="text-muted text-[0.9375rem] leading-relaxed text-center">
                                        {ACADEMY.description} Each cohort is capped at 30 seats and
                                        runs for 4 weeks. Students leave with a finished product, a
                                        repeatable workflow, and the confidence to keep building.
                                    </p>
                                </div>
                            </AnimatedSection>
                        ) : (
                            <AnimatedSection>
                                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={32} className="text-accent" />
                                </div>
                                <h2 className="text-ink mb-4">You&apos;re on the list</h2>
                                <p className="text-muted text-lg leading-relaxed mb-4">
                                    We&apos;ll send you an email as soon as applications for the next
                                    cohort open. Keep an eye on your inbox.
                                </p>
                                <CTAButton href="/" variant="secondary">
                                    Return to home
                                </CTAButton>
                            </AnimatedSection>
                        )}
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}
