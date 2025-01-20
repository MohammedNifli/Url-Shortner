import rateLimit from 'express-rate-limit';

export const createUrlRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    status: 429,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});
