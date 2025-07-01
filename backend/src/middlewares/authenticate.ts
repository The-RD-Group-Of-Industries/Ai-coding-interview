import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(400).json({ message: "AuthHeader not found" });
  }

  try {
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(400).json({ message: "No token provided" });
      throw new Error("No token");
    }
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "edab4cf04d88736a02053a97fb192ea2e514dc111da106c0e20897a61324756c0854a04160821d9cde25759c7ed233fd5c348e65b5e366616b70ae9c7fa4ed89"
    ) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decode;
    next();
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: (err as Error).message });
  }
};
