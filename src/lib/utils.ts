import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getModifierKeyLabel(): string {
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent
    if (ua.includes("Mac") || ua.includes("iPhone") || ua.includes("iPad")) {
      return "⌘"
    }
  }
  return "Ctrl"
}
