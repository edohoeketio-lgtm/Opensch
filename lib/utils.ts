import { clsx } from "clsx";

type ClassValue = string | number | bigint | boolean | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}
