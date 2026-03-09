"use client";

import { useState, FormEvent } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { COHORT, CTA } from "@/lib/constants";
import { APPLICATION_STEPS } from "@/lib/content";
import {
    CheckCircle2,
    ArrowRight,
    Users,
    Calendar,
    Clock,
    BookOpen,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    timezone: string;
    role: string;
    profiles: string;
    whyJoin: string;
    goals: string;
    buildIdea: string;
    experience: string;
    plan: string;
    whyPlan: string;
    canCommit: string;
    availableLive: string;
    understandsReview: string;
    anythingElse: string;
}

interface FormErrors {
    [key: string]: string;
}

const initialFormData: FormData = {
    fullName: "",
    email: "",
    phone: "",
    country: "",
    timezone: "",
    role: "",
    profiles: "",
    whyJoin: "",
    goals: "",
    buildIdea: "",
    experience: "",
    plan: "",
    whyPlan: "",
    canCommit: "",
    availableLive: "",
    understandsReview: "",
    anythingElse: "",
};

function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.fullName.trim()) errors.fullName = "Full name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        errors.email = "Please enter a valid email address";
    if (!data.country.trim()) errors.country = "Country/city is required";
    if (!data.timezone.trim()) errors.timezone = "Time zone is required";
    if (!data.role) errors.role = "Please select an option";
    if (!data.whyJoin.trim()) errors.whyJoin = "This field is required";
    if (!data.goals.trim()) errors.goals = "This field is required";
    if (!data.buildIdea.trim()) errors.buildIdea = "This field is required";
    if (!data.experience.trim()) errors.experience = "This field is required";
    if (!data.plan) errors.plan = "Please select a plan";
    if (!data.whyPlan.trim()) errors.whyPlan = "This field is required";
    if (!data.canCommit) errors.canCommit = "Please select an option";
    if (!data.availableLive) errors.availableLive = "Please select an option";
    if (!data.understandsReview) errors.understandsReview = "Please confirm";

    return errors;
}

// ===== Apply Hero =====
function ApplyHero() {
    return (
        <SectionWrapper gradient>
            <div className="container-wide">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                            Apply
                        </span>
                        <h1 className="text-ink mb-6">
                            Apply for the next{" "}
                            <span className="font-serif gradient-text">cohort</span>
                        </h1>
                        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
                            Seats are limited and applications are reviewed for fit. Tell us about
                            yourself, what you want to build, and which plan works for you.
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Before You Apply =====
function BeforeYouApply() {
    const items = [
        { icon: Users, text: "For students, designers, and early builders" },
        { icon: Clock, text: "4–7 hours per week for 4 weeks" },
        { icon: Calendar, text: "Live classes on Thursdays at 6:00 PM" },
        { icon: BookOpen, text: "Basic (₦100,000) and Premium (₦180,000) tiers" },
        { icon: AlertCircle, text: "Decisions sent within 2–3 days" },
    ];

    return (
        <SectionWrapper background="surface" padding="small">
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <h3 className="text-ink text-center mb-8">Before you apply</h3>
                    </AnimatedSection>
                    <AnimatedSection stagger staggerDelay={0.08}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {items.map((item, i) => (
                                <AnimatedItem key={i} direction="scale">
                                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-background/50 transition-colors duration-300">
                                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                                            <item.icon size={14} className="text-accent" />
                                        </div>
                                        <span className="text-sm text-muted">{item.text}</span>
                                    </div>
                                </AnimatedItem>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== Process Steps =====
function ProcessSteps() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="The process"
                            title={<>How applications <span className="font-serif text-accent">work</span></>}
                        />
                    </AnimatedSection>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden sm:block absolute left-4 top-5 bottom-5 w-[1px] bg-border" />

                        <div className="space-y-0">
                            {APPLICATION_STEPS.map((step, i) => (
                                <AnimatedSection key={i} delay={i * 0.08}>
                                    <div className="flex items-start gap-5 py-5 relative">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold relative z-10">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-ink text-[0.9375rem] mb-1">
                                                {step.title}
                                            </h4>
                                            <p className="text-muted text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
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

// ===== Form Field Components =====
function TextInput({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    type = "text",
}: {
    label: string;
    name: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    type?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="text-accent ml-0.5">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`form-input ${error ? "error" : ""}`}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

function TextArea({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    hint,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    hint?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="text-accent ml-0.5">*</span>}
            </label>
            {hint && <p className="form-hint mb-2">{hint}</p>}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`form-input form-textarea ${error ? "error" : ""}`}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

function RadioGroup({
    label,
    name,
    options,
    value,
    onChange,
    error,
    required = false,
}: {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    error?: string;
    required?: boolean;
}) {
    return (
        <div>
            <p className="form-label">
                {label}
                {required && <span className="text-accent ml-0.5">*</span>}
            </p>
            <div className="space-y-2 mt-1">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${value === opt.value
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-border-strong"
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${value === opt.value ? "border-accent" : "border-border-strong"
                            }`}>
                            {value === opt.value && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 rounded-full bg-accent"
                                />
                            )}
                        </div>
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            className="sr-only"
                        />
                        <span className="text-sm text-ink">{opt.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

function SelectField({
    label,
    name,
    options,
    value,
    onChange,
    error,
    required = false,
    placeholder,
}: {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="text-accent ml-0.5">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`form-input ${error ? "error" : ""} ${!value ? "text-muted/60" : ""}`}
            >
                <option value="">{placeholder || "Select an option"}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

// ===== Application Form =====
function ApplicationForm() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const updateField = (field: keyof FormData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstErrorField = Object.keys(validationErrors)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
    };

    // ===== Success State =====
    if (submitted) {
        return (
            <SectionWrapper>
                <div className="container-wide">
                    <div className="max-w-xl mx-auto text-center">
                        <AnimatedSection>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle2 size={36} className="text-accent" />
                            </motion.div>
                            <h2 className="text-ink mb-4">
                                Application <span className="font-serif text-accent">submitted</span>
                            </h2>
                            <p className="text-muted text-lg leading-relaxed mb-4">
                                Thank you for applying to the next OpenSch cohort. We&apos;ve received
                                your application and will review it shortly.
                            </p>
                            <Card className="text-left my-8">
                                <h4 className="font-semibold text-ink mb-4">What happens next</h4>
                                <ul className="space-y-3">
                                    {[
                                        "You'll receive a confirmation email shortly",
                                        "We review applications within 2–3 days",
                                        "Accepted students receive payment instructions to secure their seat",
                                        "Onboarding and orientation happen before the cohort starts",
                                    ].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            className="flex items-start gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        >
                                            <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-muted">{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </Card>
                            <CTAButton href="/" variant="secondary">
                                Return to home
                            </CTAButton>
                        </AnimatedSection>
                    </div>
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper background="surface">
            <div className="container-wide">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection>
                        <SectionHeader
                            label="Application"
                            title={<>Tell us about <span className="font-serif text-accent">yourself</span></>}
                            subtitle="All fields marked with * are required. Your information is kept confidential."
                        />
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Section 1: Personal Details */}
                            <Card className="mb-8">
                                <h3 className="font-semibold text-ink mb-6 pb-4 border-b border-border flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">1</span>
                                    Personal details
                                </h3>
                                <div className="space-y-5">
                                    <TextInput
                                        label="Full name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={updateField("fullName")}
                                        error={errors.fullName}
                                        required
                                        placeholder="Your full name"
                                    />
                                    <TextInput
                                        label="Email address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={updateField("email")}
                                        error={errors.email}
                                        required
                                        placeholder="you@example.com"
                                    />
                                    <TextInput
                                        label="Phone number / WhatsApp"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={updateField("phone")}
                                        placeholder="Optional"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Country / city"
                                            name="country"
                                            value={formData.country}
                                            onChange={updateField("country")}
                                            error={errors.country}
                                            required
                                            placeholder="Lagos, Nigeria"
                                        />
                                        <TextInput
                                            label="Time zone"
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={updateField("timezone")}
                                            error={errors.timezone}
                                            required
                                            placeholder="WAT (UTC+1)"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Section 2: Background */}
                            <Card className="mb-8">
                                <h3 className="font-semibold text-ink mb-6 pb-4 border-b border-border flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">2</span>
                                    Background
                                </h3>
                                <div className="space-y-5">
                                    <SelectField
                                        label="Which best describes you right now?"
                                        name="role"
                                        value={formData.role}
                                        onChange={updateField("role")}
                                        error={errors.role}
                                        required
                                        options={[
                                            { value: "student", label: "Student" },
                                            { value: "designer", label: "Designer" },
                                            { value: "recent-grad", label: "Recent graduate" },
                                            { value: "early-career", label: "Early-career professional" },
                                            { value: "other", label: "Other" },
                                        ]}
                                    />
                                    <TextInput
                                        label="LinkedIn, portfolio, GitHub, or X profile"
                                        name="profiles"
                                        value={formData.profiles}
                                        onChange={updateField("profiles")}
                                        placeholder="Optional — share a link"
                                    />
                                </div>
                            </Card>

                            {/* Section 3: Motivation and Goals */}
                            <Card className="mb-8">
                                <h3 className="font-semibold text-ink mb-6 pb-4 border-b border-border flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">3</span>
                                    Motivation and goals
                                </h3>
                                <div className="space-y-5">
                                    <TextArea
                                        label="Why do you want to join this cohort?"
                                        name="whyJoin"
                                        value={formData.whyJoin}
                                        onChange={updateField("whyJoin")}
                                        error={errors.whyJoin}
                                        required
                                    />
                                    <TextArea
                                        label="What do you want to learn or achieve in the next 4 weeks?"
                                        name="goals"
                                        value={formData.goals}
                                        onChange={updateField("goals")}
                                        error={errors.goals}
                                        required
                                    />
                                    <TextArea
                                        label="What do you want to build during the cohort?"
                                        name="buildIdea"
                                        value={formData.buildIdea}
                                        onChange={updateField("buildIdea")}
                                        error={errors.buildIdea}
                                        required
                                        hint="Don't worry if your idea isn't fully formed yet."
                                    />
                                    <TextArea
                                        label="What experience do you currently have with design, product building, or AI tools?"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={updateField("experience")}
                                        error={errors.experience}
                                        required
                                    />
                                </div>
                            </Card>

                            {/* Section 4: Commitment and Fit */}
                            <Card className="mb-8">
                                <h3 className="font-semibold text-ink mb-6 pb-4 border-b border-border flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">4</span>
                                    Commitment and fit
                                </h3>
                                <div className="space-y-5">
                                    <RadioGroup
                                        label="Which plan are you applying for?"
                                        name="plan"
                                        value={formData.plan}
                                        onChange={updateField("plan")}
                                        error={errors.plan}
                                        required
                                        options={[
                                            { value: "basic", label: "Basic — ₦100,000" },
                                            { value: "premium", label: "Premium — ₦180,000" },
                                        ]}
                                    />
                                    <TextArea
                                        label="Why did you choose this plan?"
                                        name="whyPlan"
                                        value={formData.whyPlan}
                                        onChange={updateField("whyPlan")}
                                        error={errors.whyPlan}
                                        required
                                    />
                                    <RadioGroup
                                        label="Can you commit 4–7 hours per week for 4 weeks?"
                                        name="canCommit"
                                        value={formData.canCommit}
                                        onChange={updateField("canCommit")}
                                        error={errors.canCommit}
                                        required
                                        options={[
                                            { value: "yes", label: "Yes" },
                                            { value: "no", label: "No" },
                                        ]}
                                    />
                                    <RadioGroup
                                        label="Are you available for the live class schedule?"
                                        name="availableLive"
                                        value={formData.availableLive}
                                        onChange={updateField("availableLive")}
                                        error={errors.availableLive}
                                        required
                                        options={[
                                            { value: "yes", label: "Yes" },
                                            { value: "no", label: "No" },
                                        ]}
                                    />
                                    <RadioGroup
                                        label="Do you understand that seats are limited and admission is reviewed?"
                                        name="understandsReview"
                                        value={formData.understandsReview}
                                        onChange={updateField("understandsReview")}
                                        error={errors.understandsReview}
                                        required
                                        options={[
                                            { value: "yes", label: "Yes" },
                                            { value: "no", label: "No" },
                                        ]}
                                    />
                                    <TextArea
                                        label="Is there anything else you'd like us to know?"
                                        name="anythingElse"
                                        value={formData.anythingElse}
                                        onChange={updateField("anythingElse")}
                                        placeholder="Optional"
                                    />
                                </div>
                            </Card>

                            {/* Submit */}
                            <div className="text-center">
                                <CTAButton
                                    type="submit"
                                    size="large"
                                    icon
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting…" : "Submit application"}
                                </CTAButton>
                                <p className="mt-4 text-sm text-muted">
                                    Your information is kept confidential and used only for the
                                    admissions process.
                                </p>
                            </div>
                        </form>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== What Happens After =====
function AfterYouApply() {
    return (
        <SectionWrapper>
            <div className="container-wide">
                <div className="max-w-xl mx-auto text-center">
                    <AnimatedSection>
                        <h3 className="text-ink mb-4">After you <span className="font-serif text-accent">apply</span></h3>
                        <p className="text-muted text-[0.9375rem] leading-relaxed mb-6">
                            You&apos;ll receive a confirmation email immediately. Our team reviews
                            applications within 2–3 days. Accepted students receive payment
                            instructions to secure their seat. Onboarding begins after payment
                            is confirmed, and orientation happens the weekend before the cohort
                            starts.
                        </p>
                        <p className="text-sm text-muted">
                            Questions?{" "}
                            <a
                                href="mailto:hello@opensch.com"
                                className="text-accent hover-underline"
                            >
                                Reach out to us
                            </a>
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </SectionWrapper>
    );
}

// ===== PAGE =====
export default function ApplyPage() {
    return (
        <>
            <ApplyHero />
            <BeforeYouApply />
            <ProcessSteps />
            <ApplicationForm />
            <AfterYouApply />
        </>
    );
}
