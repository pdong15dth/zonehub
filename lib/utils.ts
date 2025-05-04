import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string with Vietnamese characters to a URL-friendly slug
 * First removes Vietnamese accents, then creates a slug while keeping special characters
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug with special characters preserved
 */
export function createSlug(text: string): string {
  if (!text) return '';
  
  // Step 1: Convert Vietnamese to non-accented
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  
  // Step 2: Create slug but keep special characters
  const slug = normalized
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single one
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  return slug;
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
}
