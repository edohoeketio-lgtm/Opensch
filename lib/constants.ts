export const ACADEMY = {
    name: "OpenSch",
    tagline: "Learn to design, build, and ship real products with AI in 4 weeks.",
    description:
        "A premium 4-week cohort-based academy that teaches students, designers, and early builders how to design, build, and ship real products using AI-native workflows.",
    url: "https://opensch.com",
} as const;

export const COHORT = {
    duration: "4 weeks",
    isSoldOut: false,
    totalSeats: 30,
    basicSeats: 20,
    premiumSeats: 10,
    lessonsPerWeek: 12,
    totalLessons: 48,
    modulesPerWeek: 4,
    lessonsPerModule: 3,
    applicationsOpen: "2 weeks before cohort start",
    // Placeholder dates for first cohort
    dates: {
        applicationsOpen: "April 14, 2026",
        applicationsClose: "April 21, 2026",
        cohortStart: "April 28, 2026",
        cohortEnd: "May 23, 2026",
    },
} as const;

export const PRICING = {
    basic: {
        name: "Basic",
        price: "$99",
        priceValue: 99,
        seats: 20,
        tagline: "Structured learning and community",
        description:
            "Full access to the 4-week curriculum with recorded lessons, live cohort classes, assignments, and community support.",
        bestFor:
            "Independent learners who want structure, community, and a clear path to shipping — without needing close personal feedback.",
    },
    premium: {
        name: "Premium",
        price: "$199",
        priceValue: 199,
        seats: 10,
        tagline: "Closer feedback, support, and accountability",
        description:
            "Everything in Basic, plus weekly office hours, smaller feedback sessions, project critiques, portfolio polish, and priority support.",
        bestFor:
            "Learners who want tighter accountability, direct feedback on their work, and support finishing with a polished, portfolio-ready outcome.",
    },
} as const;

export const SCHEDULE = {
    weekUnlock: "Monday, 9:00 AM",
    liveClass: "Thursday, 6:00 PM",
    assignmentDeadline: "Saturday, 12:00 PM",
    premiumOfficeHour: "Saturday, 4:00 PM",
    weeklyHours: {
        basic: "4–6 hours",
        premium: "5–7 hours",
    },
} as const;

export const CTA = {
    primary: "Apply for the next cohort",
    secondary: "View curriculum",
} as const;

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Curriculum", href: "/syllabus" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "About", href: "/about" },
] as const;

export const FOOTER_LINKS = {
    pages: [
        { label: "Home", href: "/" },
        { label: "Curriculum", href: "/syllabus" },
        { label: "Pricing", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
        { label: "About", href: "/about" },
        { label: "Apply", href: "/apply" },
        { label: "Student Dashboard", href: "/dashboard" },
    ],
    resources: [
        { label: "Contact", href: "mailto:hello@opensch.com" },
    ],
    legal: [
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
    ],
} as const;

export const CATEGORY_META_MAP: Record<string, { icon: string, color: string, bg: string }> = {
    'Question': { icon: 'HelpCircle', color: 'text-white', bg: 'bg-white/5' },
    'Build': { icon: 'CheckCircle2', color: 'text-accent', bg: 'bg-accent/10' },
    'Deliverable': { icon: 'Target', color: 'text-white', bg: 'bg-deep-surface' },
    'Feedback': { icon: 'BookOpen', color: 'text-white', bg: 'bg-deep-surface' },
    'Announcement': { icon: 'Award', color: 'text-accent', bg: 'bg-accent/10' },
    'Win': { icon: 'Award', color: 'text-white', bg: 'bg-deep-surface' },
    'Resource': { icon: 'LinkIcon', color: 'text-white/60', bg: 'bg-white/5' },
    'General': { icon: 'MessageSquare', color: 'text-white', bg: 'bg-white/5' },
    'Discussion': { icon: 'MessageSquare', color: 'text-white', bg: 'bg-white/5' }
};
