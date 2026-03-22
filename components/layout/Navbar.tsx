"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, ACADEMY } from "@/lib/constants";
import { CTAButton } from "@/components/ui/CTAButton";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const isActive = (href: string) => {
        if (!mounted) return false;
        // Also handle the case where nextJS proxy adds a prefix to the path in development
        if (pathname === href) return true;
        if (pathname && href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled
                        ? "glass border-b border-ink/[0.06] shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
                        : "bg-transparent"
                )}
            >
                <nav className="container-wide flex items-center justify-between h-16 md:h-[72px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-ink font-semibold text-[1.125rem] tracking-[-0.03em] transition-all duration-300 hover:scale-[1.02]"
                    >
                        {ACADEMY.name}
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative text-[0.875rem] font-medium transition-colors duration-300 py-1",
                                    isActive(link.href)
                                        ? "text-ink"
                                        : "text-muted hover:text-ink"
                                )}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link 
                            href="/login" 
                            className="text-[0.875rem] font-medium text-ink/70 hover:text-ink transition-colors duration-300"
                        >
                            Portal Login
                        </Link>
                        <CTAButton href="/apply" size="default">
                            Apply
                        </CTAButton>
                    </div>

                    {/* Mobile Toggle */}
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-ink hover:text-accent transition-colors"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        whileTap={{ scale: 0.9 }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </motion.button>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 glass md:hidden flex flex-col"
                    >
                        <div className="h-16" />
                        <div className="flex-1 flex flex-col justify-center px-8">
                            <nav className="space-y-2">
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 + i * 0.08, type: "spring", stiffness: 200 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "block text-2xl font-medium transition-colors duration-300 py-2",
                                                pathname === link.href
                                                    ? "text-ink"
                                                    : "text-muted hover:text-ink"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                            <motion.div
                                className="mt-10 space-y-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, type: "spring" }}
                            >
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full text-center py-3 text-lg font-medium text-ink/70 hover:text-ink transition-colors"
                                >
                                    Portal Login
                                </Link>
                                <CTAButton
                                    href="/apply"
                                    size="large"
                                    className="w-full"
                                >
                                    Apply for the next cohort
                                </CTAButton>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
