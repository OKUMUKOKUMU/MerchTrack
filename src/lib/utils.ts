import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserRole } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isManagerialRole = (role: UserRole) => {
    return ['manager', 'director', 'admin'].includes(role);
}
