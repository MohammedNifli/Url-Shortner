import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || ""; 
const JWT_EXPIRATION = '1h'; 

export interface JwtPayload {
  userId: string;

  iat?: number;
  exp?: number;
}

export const generateAccessToken = (userId: string): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = { userId };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;  
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
