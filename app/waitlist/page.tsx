import type { Metadata } from "next";
import WaitlistPage from "./WaitlistPage";

export const metadata: Metadata = {
    title: "Waitlist",
    description:
        "Applications for the current OpenSch cohort are closed. Join the waitlist to be first to know when the next cohort opens.",
};

export default function Page() {
    return <WaitlistPage />;
}
