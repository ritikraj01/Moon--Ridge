import { Router } from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  duplicateBlog,
} from "../controllers/blogController";
import { protect, admin } from "../middleware/auth";

const router = Router();

// Soft-auth middleware: attaches user if token present, but does not reject
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const softProtect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      (req as any).user = (decoded as any).user;
    } catch (err) {
      // ignore invalid tokens
    }
  }
  next();
};

router.route("/").get(softProtect, getBlogs).post(protect, admin, createBlog);

router
  .route("/:id")
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

// Duplicate a blog — admin only
router.route("/:id/duplicate").post(protect, admin, duplicateBlog);

// Important: /slug/:slug must come before /:id to avoid conflicts
router.route("/slug/:slug").get(softProtect, getBlogBySlug);

export default router;
