// types/express/index.d.ts
import { JwtPayload } from '../utils/jwtUtils';

declare global {
  namespace Express {
    // Explicitly define that User should have userId
    interface User extends JwtPayload {
      userId: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}