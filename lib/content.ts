// ===== Curriculum Data =====

export interface Lesson {
    title: string;
}

export interface Module {
    title: string;
    instructor?: string;
    lessons: Lesson[];
}

export interface Week {
    number: number;
    pillar: string;
    title: string;
    goal: string;
    modules: Module[];
    deliverable: string;
    liveTheme: string;
}

export const CURRICULUM_WEEKS: Week[] = [
    {
        number: 1,
        pillar: "Setup",
        title: "Day 1 Integration",
        goal: "Hook up the tools and generate a functional front-end V1 by Friday.",
        modules: [
            {
                title: "The Stack Setup",
                lessons: [
                    { title: "Installing Antigravity" },
                    { title: "Configuring Claude Limits" },
                    { title: "Setting up Gemini Nano Banana" },
                ],
            },
            {
                title: "Prompting for UI",
                instructor: "Maurice Edohoeket",
                lessons: [
                    { title: "Generating Next.js/Tailwind Structures" },
                    { title: "Communicating Visual Intent" },
                    { title: "Iterating on Layouts Instantly" },
                ],
            },
            {
                title: "Rapid Prototyping",
                lessons: [
                    { title: "Generating 3 Core Screens in an Afternoon" },
                    { title: "Mapping State Without Writing It" },
                    { title: "Connecting Interactive Links" },
                ],
            },
            {
                title: "Refining the Output",
                instructor: "Maurice Edohoeket",
                lessons: [
                    { title: "Teaching AI to Fix Visual Bugs" },
                    { title: "Handling Responsive Breakpoints" },
                    { title: "Overriding Bad AI Assumptions" },
                ],
            },
        ],
        deliverable: "Functional Front-End V1",
        liveTheme: "Live Prototyping and AI Pair-Programming",
    },
    {
        number: 2,
        pillar: "Logic",
        title: "Connecting the Brains",
        goal: "Make the buttons actually do something using Gemini Nano Banana and Antigravity.",
        modules: [
            {
                title: "State & Data Flow",
                lessons: [
                    { title: "Prompting for React State" },
                    { title: "Explaining Component Lifecycles to Claude" },
                    { title: "Managing Global vs. Local State via AI" },
                ],
            },
            {
                title: "API & Integration Prep",
                lessons: [
                    { title: "Structuring Data Models" },
                    { title: "Writing Clear Interface Contracts" },
                    { title: "Mocking Fetch Calls" },
                ],
            },
            {
                title: "Using Gemini Nano Banana",
                lessons: [
                    { title: "Implementing Complex Logic Circuits" },
                    { title: "Handling Async Workflows" },
                    { title: "Optimizing Client-Side Logic" },
                ],
            },
            {
                title: "The 'Stuck' Protocol",
                lessons: [
                    { title: "When AI Hallucinates Bad Code" },
                    { title: "Breaking Out of Error Loops" },
                    { title: "Reading Stack Traces with Claude" },
                ],
            },
        ],
        deliverable: "Linked Up MVP Prototype",
        liveTheme: "Logic Deep Dive & Breaking Out of AI Loops",
    },
    {
        number: 3,
        pillar: "Polish",
        title: "Persistence & Polish",
        goal: "Hook up a backend and make the app look premium.",
        modules: [
            {
                title: "Backend in a Prompt",
                lessons: [
                    { title: "Generating Database Schemas" },
                    { title: "Writing Supabase/Firebase RLS Policies" },
                    { title: "Hooking Up Authentication Flows" },
                ],
            },
            {
                title: "Antigravity Deep Dive",
                instructor: "Maurice Edohoeket",
                lessons: [
                    { title: "Managing System-Level Workflows" },
                    { title: "Automating Multi-Step Operations" },
                    { title: "Advanced Antigravity Prompting" },
                ],
            },
            {
                title: "Interaction & Animation",
                instructor: "Maurice Edohoeket",
                lessons: [
                    { title: "Prompting for Framer Motion" },
                    { title: "Injecting Micro-Interactions" },
                    { title: "Polishing Hover States and Transitions" },
                ],
            },
            {
                title: "User Edge Cases",
                lessons: [
                    { title: "Securing the App Against Bad Inputs" },
                    { title: "Writing AI Guardrails" },
                    { title: "Testing Error States" },
                ],
            },
        ],
        deliverable: "Full-Stack MVP",
        liveTheme: "Database Hookups & Premium UI Polish",
    },
    {
        number: 4,
        pillar: "Ship",
        title: "Ship & Scale",
        goal: "Get it live on Vercel/Netlify and build your portfolio case study.",
        modules: [
            {
                title: "Deployment Workflows",
                lessons: [
                    { title: "Pushing Code to Production" },
                    { title: "Fixing Build Errors with Claude" },
                    { title: "Setting Environment Variables" },
                ],
            },
            {
                title: "Pre-Launch QA",
                lessons: [
                    { title: "AI-Driven Browser Testing" },
                    { title: "Auditing Accessibility and Performance" },
                    { title: "Mobile Verification" },
                ],
            },
            {
                title: "The Portfolio Story",
                instructor: "Maurice Edohoeket",
                lessons: [
                    { title: "Writing the Case Study with AI" },
                    { title: "Documenting Your Architecture" },
                    { title: "Creating Demo Videos" },
                ],
            },
            {
                title: "Launch Day",
                lessons: [
                    { title: "The Launch-Readiness Checklist" },
                    { title: "Distributing Your Product" },
                    { title: "What to Do After Phase 1" },
                ],
            },
        ],
        deliverable: "Live Product & Case Study",
        liveTheme: "Launch Party and Portfolio Reviews",
    },
];

// ===== FAQ Data =====

export interface FAQ {
    question: string;
    answer: string;
}

export interface FAQCategory {
    category: string;
    questions: FAQ[];
}

export const FAQ_DATA: FAQCategory[] = [
    {
        category: "Fit and Level",
        questions: [
            {
                question: "Is this beginner-friendly?",
                answer:
                    "Yes. The cohort is designed for people who are starting out or early in their journey. You don't need prior coding or design experience — just motivation, curiosity, and a willingness to commit to the process.",
            },
            {
                question: "Do I need to know how to code?",
                answer:
                    "No. The curriculum teaches you how to build using AI-native workflows, not traditional programming. You'll learn how to instruct tools, think through product structure, and ship real products without needing to write code from scratch.",
            },
            {
                question: "Who is this NOT for?",
                answer:
                    "This isn't for experienced developers looking for advanced technical training. It's designed for beginners, designers, and early builders who want to learn how to take ideas from concept to shipped product using modern AI tools.",
            },
        ],
    },
    {
        category: "Curriculum and Workload",
        questions: [
            {
                question: "What is the weekly time commitment?",
                answer:
                    "Basic students should expect to spend 4–6 hours per week. Premium students should plan for 5–7 hours per week due to additional office hours and feedback sessions. This includes recorded lessons, the live class, and assignment work.",
            },
            {
                question: "What do I actually build during the cohort?",
                answer:
                    "You build one real product from start to finish. In Week 1, you scope and plan your idea. In Week 2, you design the experience. In Week 3, you build the MVP. In Week 4, you polish it, ship it, and present it. You leave with a finished or functional product and a case study you can show.",
            },
            {
                question: "Can I work on my own project idea?",
                answer:
                    "Yes, and that's encouraged. The curriculum is designed to guide your own project through the entire process. You'll receive feedback and support to keep your idea realistic and on track for a 4-week build.",
            },
        ],
    },
    {
        category: "Live Sessions and Replays",
        questions: [
            {
                question: "Are live sessions recorded?",
                answer:
                    "Yes. All live cohort classes are recorded and made available to students after the session. Premium office hours may be recorded depending on the format, but the real value is in attending live for direct feedback.",
            },
            {
                question: "What if I miss a live class?",
                answer:
                    "You can watch the recording. However, attending live is strongly recommended — the live sessions are where you get real-time feedback, see other students' work, and get clarity on that week's challenges.",
            },
            {
                question: "What time zone are the live sessions in?",
                answer:
                    "Live sessions follow West Africa Time (WAT). The live cohort class is on Thursdays at 6:00 PM, and the Premium office hour is on Saturdays at 4:00 PM. Recordings are available if the timing doesn't work perfectly for you.",
            },
        ],
    },
    {
        category: "Basic vs Premium",
        questions: [
            {
                question: "What is the difference between Basic and Premium?",
                answer:
                    "Both tiers include the full 4-week curriculum, recorded lessons, live cohort classes, assignments, community access, and a certificate. Premium adds weekly office hours, smaller feedback sessions, priority Q&A, project critique and build reviews, and portfolio polish support. It's about the level of feedback and accountability you want.",
            },
            {
                question: "Is Premium worth the extra cost?",
                answer:
                    "If you want direct feedback on your work, closer accountability, and support finishing with a stronger, more polished outcome — yes. Premium is designed for students who will actively use the extra touchpoints. If you're a confident self-learner, Basic gives you everything you need to succeed.",
            },
            {
                question: "Can I upgrade from Basic to Premium later?",
                answer:
                    "Tier selection happens during the application process and is confirmed upon payment. Upgrades may be possible before the cohort starts if Premium seats are still available, but we cannot guarantee availability.",
            },
        ],
    },
    {
        category: "Applications and Admissions",
        questions: [
            {
                question: "How does the application process work?",
                answer:
                    "You submit your application through the Apply page. We review all applications manually and send decisions within 2–3 days. If accepted, you'll receive payment instructions with a deadline to secure your seat.",
            },
            {
                question: "What are you looking for in an application?",
                answer:
                    "Clear motivation, a realistic project idea for a 4-week scope, fit with our target audience, and the ability to commit time to the cohort. We're not looking for perfection — we're looking for people who are serious about building and shipping.",
            },
            {
                question: "What happens if I'm not accepted?",
                answer:
                    "You'll receive a clear update. Not being accepted doesn't mean you're not a strong fit — it often comes down to cohort size, timing, or fit for a particular round. We keep applicants in mind for future cohorts.",
            },
        ],
    },
    {
        category: "Payment and Seat Confirmation",
        questions: [
            {
                question: "When is my seat confirmed?",
                answer:
                    "Your seat is only confirmed once payment has been received. Accepted students receive a payment link with a deadline. If payment isn't completed by the deadline, the seat may be released to someone on the waitlist.",
            },
            {
                question: "What payment methods do you accept?",
                answer:
                    "Payment details and methods will be shared with accepted students in the acceptance email. We aim to make the payment process as straightforward as possible.",
            },
            {
                question: "Is there a guarantee or refund policy?",
                answer:
                    "Yes. We offer a 14-Day Action-Based Guarantee. If you show up for the first two weeks, complete the assignments, and find that the cohort isn't delivering the value promised, we'll issue a full refund. We want you to feel completely confident, while ensuring we're working with builders who are ready to put in the effort.",
            },
        ],
    },
    {
        category: "Certificate and Completion",
        questions: [
            {
                question: "What do I need to complete to earn the certificate?",
                answer:
                    "Certificate eligibility is based on assignment completion and live class participation. You need to submit your weekly assignments, participate in the live sessions, and complete your final project. Specific thresholds will be shared at orientation.",
            },
            {
                question: "What does the certificate represent?",
                answer:
                    "The certificate represents completion of a structured 4-week cohort where you designed, built, and shipped a real product using AI-native workflows. It's a proof of work, not just attendance — tied to a real project outcome.",
            },
        ],
    },
];

// ===== Proof Strip Data =====

export const PROOF_ITEMS = [
    { label: "4-week cohort" },
    { label: "48 recorded lessons" },
    { label: "Weekly live classes" },
    { label: "Application-based" },
    { label: "30 seats per cohort" },
    { label: "Final project outcome" },
];

// ===== Process Steps =====

export const APPLICATION_STEPS = [
    {
        step: 1,
        title: "Submit your application",
        description: "Complete the application form with your background, goals, and project idea.",
    },
    {
        step: 2,
        title: "We review it",
        description: "Applications are reviewed manually for motivation, fit, and commitment.",
    },
    {
        step: 3,
        title: "You receive a decision",
        description: "Expect an update within 2–3 days with your acceptance status.",
    },
    {
        step: 4,
        title: "Complete payment",
        description: "Accepted students receive a payment link with a deadline to secure their seat.",
    },
    {
        step: 5,
        title: "Onboarding begins",
        description: "Get community access, calendar invites, and everything you need before the cohort starts.",
    },
];

// ===== Comparison Table Data =====

export interface ComparisonFeature {
    feature: string;
    basic: boolean | string;
    premium: boolean | string;
}

export const COMPARISON_FEATURES: ComparisonFeature[] = [
    { feature: "4-week curriculum", basic: true, premium: true },
    { feature: "48 recorded lessons", basic: true, premium: true },
    { feature: "Weekly live cohort class", basic: true, premium: true },
    { feature: "Weekly assignments & checkpoints", basic: true, premium: true },
    { feature: "Community access", basic: true, premium: true },
    { feature: "Resource library", basic: true, premium: true },
    { feature: "Final project submission", basic: true, premium: true },
    { feature: "Certificate of completion", basic: true, premium: true },
    { feature: "Weekly Premium office hours", basic: false, premium: true },
    { feature: "Smaller feedback sessions", basic: false, premium: true },
    { feature: "Priority Q&A and support", basic: false, premium: true },
    { feature: "Project critique & build reviews", basic: false, premium: true },
    { feature: "Portfolio / demo polish support", basic: false, premium: true },
    { feature: "Closer accountability", basic: false, premium: true },
];

// ===== Learning Outcomes =====

export const LEARNING_OUTCOMES = [
    "Product thinking and idea validation",
    "AI-native workflow design with Google Antigravity",
    "UX structure and user flow mapping",
    "Prompt-to-build translation using Claude & Gemini Nano Banana",
    "Iteration and debugging strategies",
    "Product polish and presentation",
];

// ===== Audience Segments =====

export const AUDIENCE_SEGMENTS = [
    {
        title: "Students",
        description: "Build real projects that go beyond coursework and stand out in your portfolio.",
    },
    {
        title: "Designers",
        description: "Go from designing interfaces to actually building and shipping the products you envision.",
    },
    {
        title: "Early Builders",
        description: "Turn your side-project ideas into structured, shipped products with accountability and feedback.",
    },
    {
        title: "Idea-Stage Creators",
        description: "Get the structure, tools, and execution support to bring your ideas to life for the first time.",
    },
];

// ===== Student Outcomes =====

export const STUDENT_OUTCOMES = [
    {
        title: "A finished product",
        description: "Leave with a real, functional product you designed, built, and shipped during the cohort.",
    },
    {
        title: "A repeatable workflow",
        description: "Learn an AI-native build process you can use again for any future project.",
    },
    {
        title: "Stronger product thinking",
        description: "Develop the ability to scope, plan, and design products with clarity and intention.",
    },
    {
        title: "Portfolio-ready work",
        description: "Present your project as a case study or demo that shows what you can build.",
    },
    {
        title: "Confidence to build independently",
        description: "Walk away knowing you can take an idea from concept to shipped product on your own.",
    },
];
