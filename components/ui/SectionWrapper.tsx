"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    background?: "default" | "surface" | "deep";
    padding?: "default" | "small" | "none";
    id?: string;
    gradient?: boolean;
}

export function SectionWrapper({
    children,
    className,
    background = "default",
    padding = "default",
    id,
    gradient = false,
}: SectionWrapperProps) {
    return (
        <section
            id={id}
            className={cn(
                "relative",
                padding === "default" && "section-padding",
                padding === "small" && "section-padding-sm",
                background === "surface" && "bg-surface",
                background === "deep" && "bg-deep text-white",
                className
            )}
        >
            {/* Gradient mesh overlay for hero sections */}
            {gradient && (
                <div className="gradient-mesh">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
            )}
            <div className="relative z-[2]">{children}</div>
        </section>
    );
}
