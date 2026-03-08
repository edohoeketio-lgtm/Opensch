"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "scale";
    stagger?: boolean;
    staggerDelay?: number;
}

const directionVariants = {
    up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
};

export function AnimatedSection({
    children,
    className,
    delay = 0,
    direction = "up",
    stagger = false,
    staggerDelay = 0.08,
}: AnimatedSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const variant = directionVariants[direction];

    if (stagger) {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: staggerDelay,
                            delayChildren: delay,
                        },
                    },
                }}
                className={className}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={ref}
            initial={variant.hidden}
            animate={isInView ? variant.visible : variant.hidden}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// For children inside stagger containers
export function AnimatedItem({
    children,
    className,
    direction = "up",
}: {
    children: ReactNode;
    className?: string;
    direction?: "up" | "left" | "right" | "scale";
}) {
    const variant = directionVariants[direction];

    return (
        <motion.div
            variants={{
                hidden: variant.hidden,
                visible: {
                    ...variant.visible,
                    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
