// ===== Curriculum Data =====

export interface Lesson {
    title: string;
}

export interface Module {
    title: string;
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
        pillar: "Think",
        title: "Think, Scope, and Plan",
        goal: "Define a clear, buildable product idea and create a structured plan before touching any tools.",
        modules: [
            {
                title: "The New Builder Mindset",
                lessons: [
                    { title: "Welcome to the Cohort: What You're Here to Build" },
                    { title: "What Vibe Coding Actually Means" },
                    { title: "How AI Changes What's Possible for Builders" },
                ],
            },
            {
                title: "Choosing the Right Idea",
                lessons: [
                    { title: "What Makes an Idea Worth Building in 4 Weeks" },
                    { title: "Evaluating Ideas for Scope, Impact, and Feasibility" },
                    { title: "Refining Your Idea into a Product Thesis" },
                ],
            },
            {
                title: "Scoping the MVP",
                lessons: [
                    { title: "What an MVP Is — and What It Isn't" },
                    { title: "Feature Prioritization for a 4-Week Build" },
                    { title: "Defining Success for Your Project" },
                ],
            },
            {
                title: "Planning Before Prompting",
                lessons: [
                    { title: "Turning Ideas into Structured Inputs" },
                    { title: "Writing a Product Brief That Works" },
                    { title: "Planning the Build Timeline" },
                ],
            },
        ],
        deliverable: "Product Clarity Pack",
        liveTheme: "Idea selection, scoping, and product clarity",
    },
    {
        number: 2,
        pillar: "Design",
        title: "Design the Experience",
        goal: "Map the user journey, wireframe key screens, and establish a design direction ready for build week.",
        modules: [
            {
                title: "UX Before UI",
                lessons: [
                    { title: "Why Good Products Start with Flow, Not Screens" },
                    { title: "Understanding Users Without a Research Team" },
                    { title: "Mapping the Core User Flow" },
                ],
            },
            {
                title: "Structure the Product",
                lessons: [
                    { title: "Information Architecture for Small Products" },
                    { title: "Defining Screens and Navigation" },
                    { title: "Content Strategy for Builders" },
                ],
            },
            {
                title: "Wireframe with Intention",
                lessons: [
                    { title: "Wireframing for Speed and Clarity" },
                    { title: "From Wireframe to Interaction Flow" },
                    { title: "Common UX Patterns That Work" },
                ],
            },
            {
                title: "Visual Direction and System Thinking",
                lessons: [
                    { title: "Design Systems for Fast Builders" },
                    { title: "Choosing a Visual Direction" },
                    { title: "Preparing Your Design for Build Week" },
                ],
            },
        ],
        deliverable: "Experience Design Pack",
        liveTheme: "UX critique, flow review, and design direction",
    },
    {
        number: 3,
        pillar: "Build",
        title: "Build the MVP",
        goal: "Translate designs into a working product using AI-native build tools and workflows.",
        modules: [
            {
                title: "Translating Design into Build Instructions",
                lessons: [
                    { title: "From Product Brief to Build Prompt" },
                    { title: "Breaking Down Features into Buildable Tasks" },
                    { title: "Writing Instructions AI Tools Can Follow" },
                ],
            },
            {
                title: "Working with AI Tools and Agents",
                lessons: [
                    { title: "Choosing the Right Tool for the Job" },
                    { title: "Effective Prompt Strategies for Building" },
                    { title: "Managing Multi-Step AI Workflows" },
                ],
            },
            {
                title: "Core Product Build",
                lessons: [
                    { title: "Building the Main Screens" },
                    { title: "Adding Logic and Functionality" },
                    { title: "Connecting the Pieces Together" },
                ],
            },
            {
                title: "Debug, Improve, Repeat",
                lessons: [
                    { title: "Debugging with Better Instructions" },
                    { title: "MVP Progress Review" },
                    { title: "Iteration Strategies That Save Time" },
                ],
            },
        ],
        deliverable: "MVP Build Review",
        liveTheme: "Build walkthrough, debugging, and iteration",
    },
    {
        number: 4,
        pillar: "Ship",
        title: "Polish, Ship, and Present",
        goal: "Refine the product, prepare it for launch, and present it as a portfolio-ready case study.",
        modules: [
            {
                title: "Polish the Product",
                lessons: [
                    { title: "What Makes a Product Feel Finished" },
                    { title: "Visual and Interaction Polish" },
                    { title: "Edge Cases and Final Fixes" },
                ],
            },
            {
                title: "Prepare for Launch",
                lessons: [
                    { title: "The Launch-Readiness Checklist" },
                    { title: "Setting Up Hosting and Deployment" },
                    { title: "Pre-Launch Testing and QA" },
                ],
            },
            {
                title: "Tell the Story of the Product",
                lessons: [
                    { title: "How to Present Your Product Clearly" },
                    { title: "Turning the Project into a Case Study" },
                    { title: "Writing About What You Built" },
                ],
            },
            {
                title: "Showcase and Next Steps",
                lessons: [
                    { title: "Final Demo Preparation" },
                    { title: "What to Do After the Cohort" },
                    { title: "Building Your Next Product" },
                ],
            },
        ],
        deliverable: "Final Launch Pack",
        liveTheme: "Polish, demos, and final presentation prep",
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
                question: "Is there a refund policy?",
                answer:
                    "Our refund and transfer policy will be shared with accepted students before payment. We want every student to feel confident in their decision before committing.",
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
    "AI-native workflow design",
    "UX structure and user flow mapping",
    "Prompt-to-build translation",
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
