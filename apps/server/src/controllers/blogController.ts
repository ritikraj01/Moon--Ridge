import { Request, Response } from "express";
import Blog from "../models/Blog";

// Get blogs
// If admin and status query is provided, can fetch drafts or all
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { status, limit } = req.query;
    let query: any = { status: "published" };

    // If admin is requesting drafts or all
    if ((req as any).user && (req as any).user.role === "admin") {
      if (status === "draft") {
        query.status = "draft";
      } else if (status === "all") {
        delete query.status;
      }
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit as string) : 0);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // If draft, only admin can view
    if (blog.status === "draft") {
      if (!(req as any).user || (req as any).user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this draft" });
      }
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(400).json({ message: "Invalid blog data", error });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(400).json({ message: "Invalid update data", error });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
