"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
    label?: string;
    title: string | ReactNode;
    subtitle?: string;
    centered?: boolean;
    serif?: boolean;
    light?: boolean;
    className?: string;
}

export function SectionHeader({
    label,
    title,
    subtitle,
    centered = true,
    serif = false,
    light = false,
    className,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                centered && "text-center",
                "mb-14 md:mb-20",
                className
            )}
        >
            {label && (
                <div
                    className={cn(
                        "flex items-center gap-3 mb-5",
                        centered && "justify-center"
                    )}
                >
                    <span className={cn(
                        "h-[1px] w-6",
                        light ? "bg-white/20" : "bg-accent/30"
                    )} />
                    <span
                        className={cn(
                            "inline-block text-xs font-semibold uppercase tracking-[0.2em]",
                            light ? "text-accent-light" : "text-accent"
                        )}
                    >
                        {label}
                    </span>
                    <span className={cn(
                        "h-[1px] w-6",
                        light ? "bg-white/20" : "bg-accent/30"
                    )} />
                </div>
            )}
            <h2
                className={cn(
                    serif && "font-serif",
                    light ? "text-white" : "text-ink"
                )}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={cn(
                        "mt-5 text-lg max-w-2xl leading-relaxed",
                        centered && "mx-auto",
                        light ? "text-deep-muted" : "text-muted"
                    )}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
