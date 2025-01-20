import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwtUtils.js';

export const authenticateJWT: RequestHandler = (req, res, next) => {
    const token = req.cookies.access_token || req.header('Authorization')?.split(" ")[1];
  
    if (!token) {
      res.status(403).json({ message: 'Token is missing' });
      return;
    }
  
    try {
      const decoded = verifyToken(token);
      req.user = decoded;  // This will now have the correct type
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      return;
    }
  };
