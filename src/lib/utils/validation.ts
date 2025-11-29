/**
 * Validation Utilities
 * Common validation functions
 */

import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, VALIDATION } from "@/src/shared/constants";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      valid: false,
      error: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate nickname
 */
export function validateNickname(nickname: string): ValidationResult {
  const trimmed = nickname.trim();

  if (trimmed.length < VALIDATION.nickname.minLength) {
    return {
      valid: false,
      error: "Nickname is required",
    };
  }

  if (trimmed.length > VALIDATION.nickname.maxLength) {
    return {
      valid: false,
      error: `Nickname must be ${VALIDATION.nickname.maxLength} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address",
    };
  }

  return { valid: true };
}
