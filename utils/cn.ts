import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Hàm này giúp gộp các class Tailwind lại với nhau một cách thông minh
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}