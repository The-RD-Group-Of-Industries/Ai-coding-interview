import InterviewScore from "../models/InterviewScore";
import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const evaluateScore = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
    
};
