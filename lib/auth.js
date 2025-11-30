import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Get user ID from JWT token in request headers
 */
export function getUserId(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

/**
 * Get user object from JWT token (includes role)
 */
export async function getUser(request) {
  const userId = getUserId(request);
  if (!userId) return null;
  
  try {
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user is admin
 */
export async function requireAdmin(request) {
  const user = await getUser(request);
  
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  if (user.role !== 'admin') {
    return { error: 'Forbidden - Admin access required', status: 403 };
  }
  
  return { user };
}

