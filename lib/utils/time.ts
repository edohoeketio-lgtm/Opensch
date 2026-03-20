"use client";

import { useState, useEffect } from "react";

/**
 * Returns a hydration-safe greeting based on the user's local time.
 * Falls back to a generic greeting during SSR to prevent hydration errors.
 */
export function useTimeGreeting(firstName: string | null | undefined): string {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    let timePhrase = "Good evening";
    if (hour >= 5 && hour < 12) {
      timePhrase = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      timePhrase = "Good afternoon";
    }

    const nameStr = firstName ? `, ${firstName}` : "";
    setGreeting(`${timePhrase}${nameStr}`);
  }, [firstName]);

  return greeting;
}

/**
 * Parses a full name into a first name.
 */
export function extractFirstName(fullName: string | null | undefined): string | null {
  if (!fullName) return null;
  const parts = fullName.trim().split(" ");
  return parts[0];
}
