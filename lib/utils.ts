import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { marked } from "marked";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderMarkdown(content: string): string | Promise<string> {
  return marked(content, {
    gfm: true,
    breaks: true,
    // headerIds: true,
    // mangle: false,
  });
}
