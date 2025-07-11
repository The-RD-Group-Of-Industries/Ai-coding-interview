import {
  assignInterviewToUsers,
  getAllInterviews,
  newInterview,
  rejectUser,
  selectUser,
  submittedInterviews,
} from "../controllers/admin.interviewController";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";
const router: Router = Router();

router.post("/new", authenticate, adminOnly, newInterview);
router.get("/get-all", authenticate, adminOnly, getAllInterviews);
router.post(
  "/assign/:interviewId", 
  authenticate,
  adminOnly,
  assignInterviewToUsers
);
router.get(
  "/submitted-interviews",
  authenticate,
  adminOnly,
  submittedInterviews
);
router.post("/select-user/:attendedBy", authenticate, adminOnly, selectUser);

router.delete("/reject-user/:attendedBy", authenticate, adminOnly, rejectUser);

export default router;
