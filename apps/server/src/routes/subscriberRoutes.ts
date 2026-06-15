import { Router } from "express";
import { addSubscriber } from "../controllers/subscriberController";

const router = Router();

router.post("/", addSubscriber);

export default router;
