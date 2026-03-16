import type { Metadata } from "next";
import PricingPage from "./PricingPage";

export const metadata: Metadata = {
    title: "Pricing",
    description:
        "Compare OpenSch Basic (₦100,000) and Premium (₦180,000) tiers. See what's included in each plan and choose the right level of support.",
};

export default function Page() {
    return <PricingPage />;
}
