import { clsx } from "clsx";

type ClassValue = string | number | bigint | boolean | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function getAvatarColor(initial: string) {
  if (!initial) return "hsl(0, 0%, 15%)";
  return `hsl(${(initial.charCodeAt(0) * 47) % 360}, 60%, 15%)`;
}
