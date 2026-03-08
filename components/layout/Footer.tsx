"use client";

import Link from "next/link";
import { ACADEMY, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
    return (
        <footer className="bg-deep text-white relative overflow-hidden">
            {/* Top gradient accent line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <div className="container-wide section-padding">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            className="text-white font-semibold text-lg tracking-[-0.03em] hover:text-accent transition-colors duration-300"
                        >
                            {ACADEMY.name}
                        </Link>
                        <p className="mt-4 text-deep-muted text-sm leading-relaxed max-w-xs">
                            {ACADEMY.tagline}
                        </p>
                    </div>

                    {/* Pages */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-muted mb-5">
                            Pages
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.pages.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-deep-muted hover:text-white transition-colors duration-300 hover-underline"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-muted mb-5">
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-deep-muted hover:text-white transition-colors duration-300 hover-underline"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-muted mb-5">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-deep-muted hover:text-white transition-colors duration-300 hover-underline"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-deep-muted/70">
                        © {new Date().getFullYear()} {ACADEMY.name}. All rights reserved.
                    </p>
                    <p className="text-xs text-deep-muted/60">
                        Built with intention.
                    </p>
                </div>
            </div>
        </footer>
    );
}
