import type { Metadata } from "next";
import ApplyPage from "./ApplyPage";

export const metadata: Metadata = {
    title: "Apply",
    description:
        "Apply for the next OpenSch cohort. Seats are limited and admission is reviewed for fit. Submit your application and hear back within 2–3 days.",
};

export default function Page() {
    return <ApplyPage />;
}
