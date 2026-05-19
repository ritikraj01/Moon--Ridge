import { Router } from "express";
import { firebaseAuth } from "../controllers/authController";

const router = Router();

router.post("/firebase", firebaseAuth);

export default router;
