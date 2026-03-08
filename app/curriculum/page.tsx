import type { Metadata } from "next";
import CurriculumPage from "./CurriculumPage";

export const metadata: Metadata = {
    title: "Curriculum",
    description:
        "Explore the 4-week OpenSch curriculum: Think, Design, Build, Ship. 48 recorded lessons, weekly live classes, and a final project outcome.",
};

export default function Page() {
    return <CurriculumPage />;
}
