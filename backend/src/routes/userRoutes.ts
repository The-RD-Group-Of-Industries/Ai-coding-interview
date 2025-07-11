import { deleteUser, getAllUsers } from "../controllers/userController";
import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";

const router: Router = express.Router();

router.get("/users", authenticate, adminOnly, getAllUsers);
router.delete("/users/:id", authenticate, adminOnly, deleteUser);

export default router;
