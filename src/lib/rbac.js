import { getUserFromToken } from "./auth";
import { prisma } from "./prisma";

/**
 * Role-based access control utilities
 */

export const Roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  LP_STAFF: 'LP_STAFF'
};

/**
 * Check if user has required role
 * @param {string} userId - User ID
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Promise<boolean>} - True if user has required role
 */
export async function hasRole(userId, allowedRoles) {
  if (!userId) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) return false;

    return allowedRoles.includes(user.role);
  } catch (error) {
    console.error("Role check error:", error);
    return false;
  }
}

/**
 * Middleware to check if current user has required role
 * Returns user object if authorized, null otherwise
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Promise<Object|null>} - User object or null
 */
export async function requireRole(allowedRoles) {
  const userId = await getUserFromToken();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user || !allowedRoles.includes(user.role)) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Role check error:", error);
    return null;
  }
}

/**
 * Check if user is LP Staff
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isLPStaff(userId) {
  return hasRole(userId, [Roles.LP_STAFF, Roles.ADMIN]);
}

/**
 * Check if user is Admin
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
  return hasRole(userId, [Roles.ADMIN]);
}
