import { Router } from "express";
import {
  getAllInterviews,
  getInterviewQuestions,
  submitInterview,
} from "../controllers/user.interviewController";
import { authenticate } from "../middlewares/authenticate";

const router: Router = Router();

router.get("/interviews", authenticate, getAllInterviews); 
router.get("/questions/:interviewId", authenticate, getInterviewQuestions);
router.post("/interview/submit/:interviewId", authenticate, submitInterview);

export default router;
