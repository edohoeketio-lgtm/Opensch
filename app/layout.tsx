import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
    variable: "--font-instrument-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "OpenSch — Learn to design, build, and ship real products with AI",
        template: "%s | OpenSch",
    },
    description:
        "A premium 4-week cohort-based academy that teaches students, designers, and early builders how to design, build, and ship real products using AI-native workflows.",
    openGraph: {
        title: "OpenSch — Learn to design, build, and ship real products with AI",
        description:
            "A premium 4-week cohort-based academy for students, designers, and early builders. Apply for the next cohort.",
        siteName: "OpenSch",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
            <body className="min-h-screen flex flex-col bg-black text-white">
                {children}
            </body>
        </html>
    );
}
