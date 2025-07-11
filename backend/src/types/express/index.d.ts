// types/express/index.d.ts
import { UserRole } from "../yourEnumsOrTypes"; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
