import type { Metadata } from "next";
import FAQPage from "./FAQPage";

export const metadata: Metadata = {
    title: "FAQ",
    description:
        "Frequently asked questions about OpenSch — fit, curriculum, live sessions, pricing, applications, payment, and certification.",
};

export default function Page() {
    return <FAQPage />;
}
