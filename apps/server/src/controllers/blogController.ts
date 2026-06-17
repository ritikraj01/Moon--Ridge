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
    // Ensure contentBlocks is initialized
    const blogData = {
      ...req.body,
      contentBlocks: req.body.contentBlocks || [],
    };
    const newBlog = new Blog(blogData);
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
    const updateData = { ...req.body };
    // If contentBlocks is explicitly passed (even empty array), use it
    if (req.body.contentBlocks !== undefined) {
      updateData.contentBlocks = req.body.contentBlocks;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
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

// Duplicate a blog (creates a draft copy)
export const duplicateBlog = async (req: Request, res: Response) => {
  try {
    const source = await Blog.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const baseSlug = `${source.slug}-copy`;
    let slug = baseSlug;
    let counter = 1;

    // Find a unique slug
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const copy = new Blog({
      title: `${source.title} (Copy)`,
      slug,
      content: source.content,
      contentBlocks: source.contentBlocks,
      thumbnail: source.thumbnail,
      cover: source.cover,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogImage: source.ogImage,
      status: "draft",
      author: source.author,
      authorAvatar: source.authorAvatar,
      readTime: source.readTime,
      category: source.category,
      excerpt: source.excerpt,
      featured: false,
      tripDate: source.tripDate,
      tripLocation: source.tripLocation,
      travelRoute: source.travelRoute,
    });

    const saved = await copy.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
