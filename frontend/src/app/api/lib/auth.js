import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function verifyAuth(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function generateToken(user) {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  );
}

export async function getToken() {
  try {
    const cookieStore = cookies();
    const token = await cookieStore.get('token');

    if (!token) {
      return null;
    }

    return token.value;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}
