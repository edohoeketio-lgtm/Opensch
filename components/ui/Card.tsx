"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    padding?: "default" | "large";
}

export function Card({
    children,
    className,
    hover = false,
    glow = false,
    padding = "default",
}: CardProps) {
    const cardContent = (
        <div
            className={cn(
                "bg-surface border border-border rounded-2xl relative",
                padding === "default" && "p-6 md:p-8",
                padding === "large" && "p-8 md:p-10",
                glow && "glow-border",
                className
            )}
        >
            {children}
        </div>
    );

    if (hover) {
        return (
            <motion.div
                whileHover={{
                    y: -4,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className="h-full"
            >
                <div
                    className={cn(
                        "bg-surface border border-border rounded-2xl relative h-full",
                        "transition-all duration-300 hover:border-border-strong hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]",
                        padding === "default" && "p-6 md:p-8",
                        padding === "large" && "p-8 md:p-10",
                        glow && "glow-border",
                        className
                    )}
                >
                    {children}
                </div>
            </motion.div>
        );
    }

    return cardContent;
}
