"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CTAButtonProps {
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "dark";
    size?: "default" | "large";
    icon?: boolean;
    children: ReactNode;
    className?: string;
    type?: "button" | "submit";
    disabled?: boolean;
}

export function CTAButton({
    href,
    onClick,
    variant = "primary",
    size = "default",
    icon = false,
    children,
    className,
    type = "button",
    disabled = false,
}: CTAButtonProps) {
    const baseStyles = cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        size === "default" && "px-6 py-3 text-[0.9375rem] rounded-lg",
        size === "large" && "px-8 py-4 text-base rounded-xl",
        variant === "primary" &&
        "bg-ink text-white hover:bg-accent shimmer-button",
        variant === "secondary" &&
        "bg-transparent text-ink border-[1.5px] border-border-strong hover:border-accent hover:text-accent",
        variant === "dark" &&
        "bg-white text-ink hover:bg-accent hover:text-white shimmer-button",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
    );

    const inner = (
        <>
            {children}
            {icon && (
                <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                />
            )}
        </>
    );

    const MotionLink = motion.create ? motion.create(Link) : (motion as any)(Link);

    if (href) {
        return (
            <MotionLink
                href={href}
                className={cn(baseStyles, "inline-block")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                {inner}
            </MotionLink>
        );
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseStyles}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {inner}
        </motion.button>
    );
}
