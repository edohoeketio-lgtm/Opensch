import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
    title: "About",
    description:
        "Meet the founder behind OpenSch. Learn why this academy exists, the teaching philosophy, and what makes the cohort experience different.",
};

export default function Page() {
    return <AboutPage />;
}
