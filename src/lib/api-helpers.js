import { NextResponse } from "next/server";

/**
 * Create a standardized error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a standardized success response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @param {string} context - Context of the error
 * @returns {NextResponse}
 */
export function handleApiError(error, context = "API") {
  console.error(`[${context}] Error:`, error);
  return errorResponse("Internal server error", 500);
}

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object|null} - Error response or null if valid
 */
export function validateRequiredFields(body, requiredFields) {
  const missing = requiredFields.filter(field => body[field] === undefined || body[field] === null);
  if (missing.length > 0) {
    return errorResponse(`Missing required fields: ${missing.join(", ")}`, 400);
  }
  return null;
}

/**
 * Extract user ID from decoded JWT payload
 * @param {Object} decoded - Decoded JWT payload
 * @returns {string} - User ID
 */
export function extractUserId(decoded) {
  return decoded.sub || decoded.userId;
}
