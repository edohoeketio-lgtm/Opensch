"use client";

import { useState, useEffect } from "react";

/**
 * Returns a hydration-safe greeting based on the user's local time.
 * Falls back to a generic greeting during SSR to prevent hydration errors.
 */
export function useTimeGreeting(lastName: string | null | undefined): string {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    let timePhrase = "Good evening";
    if (hour >= 5 && hour < 12) {
      timePhrase = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      timePhrase = "Good afternoon";
    }

    const nameStr = lastName ? `, ${lastName}` : "";
    setGreeting(`${timePhrase}${nameStr}`);
  }, [lastName]);

  return greeting;
}

/**
 * Parses a full name into a last name. If only one name is provided, uses that.
 */
export function extractLastName(fullName: string | null | undefined): string | null {
  if (!fullName) return null;
  const parts = fullName.trim().split(" ");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return parts[0];
}
