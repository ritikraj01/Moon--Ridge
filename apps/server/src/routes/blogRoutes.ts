import { Router } from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { protect, admin } from "../middleware/auth";

const router = Router();

// To correctly handle optional protect for getBlogs/getBlogBySlug:
// We can use a soft auth middleware that doesn't reject if token is missing,
// or we just let protect handle it if we create a specific route for admin blogs.
// But we'll use a simple custom middleware for soft auth just for these routes
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const softProtect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      (req as any).user = (decoded as any).user;
    } catch (err) {
      // ignore
    }
  }
  next();
};

router.route("/").get(softProtect, getBlogs).post(protect, admin, createBlog);

router
  .route("/:id")
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

// Important: Put /slug/:slug so it doesn't conflict with /:id
router.route("/slug/:slug").get(softProtect, getBlogBySlug);

export default router;
