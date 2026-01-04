import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Get user ID from JWT token in cookies
 * @returns {Promise<string|null>} - User ID or null if not authenticated
 */
export async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth");
    if (!token) return null;

    const decoded = jwt.verify(token.value, JWT_SECRET);
    return decoded.sub || decoded.userId;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Create JWT token for user
 * @param {Object} payload - Token payload
 * @param {string} payload.sub - User ID
 * @param {string} payload.role - User role
 * @returns {string} - JWT token
 */
export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Set authentication cookie
 * @param {Response} response - NextResponse object
 * @param {string} token - JWT token
 */
export function setAuthCookie(response, token) {
  response.cookies.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear authentication cookie
 * @param {Response} response - NextResponse object
 */
export function clearAuthCookie(response) {
  response.cookies.set("auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
