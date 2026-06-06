import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminEmails = process.env.ADMIN_EMAILS 
      ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) 
      : [];
    if (process.env.ADMIN_EMAIL_USER && !adminEmails.includes(process.env.ADMIN_EMAIL_USER)) {
      adminEmails.push(process.env.ADMIN_EMAIL_USER.trim());
    }

    const expectedRole = adminEmails.includes(email) ? "admin" : "user";

    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: "local",
      role: expectedRole,
    });

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (user.provider !== "local" || !user.password) {
      return res.status(400).json({ message: "Invalid credentials. Please login with your registered provider." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No idToken provided" });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email not provided in token" });
    }

    // Find or create user
    let user = await User.findOne({ email });

    const adminEmails = process.env.ADMIN_EMAILS 
      ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) 
      : [];
    // Fallback for backward compatibility
    if (process.env.ADMIN_EMAIL_USER && !adminEmails.includes(process.env.ADMIN_EMAIL_USER)) {
      adminEmails.push(process.env.ADMIN_EMAIL_USER.trim());
    }

    const expectedRole = adminEmails.includes(email) ? "admin" : "user";

    if (!user) {
      user = new User({
        email,
        name: name || email.split('@')[0],
        firebaseUid: uid,
        provider: 'google',
        avatar: picture || '',
        role: expectedRole,
      });
      await user.save();
    } else {
      // Update role if the ADMIN_EMAIL_USER env variable changed
      if (user.role !== expectedRole) {
        user.role = expectedRole;
        await user.save();
      }
      // Update firebase UID if missing or different (migration scenario)
      if (user.firebaseUid !== uid) {
        user.firebaseUid = uid;
        user.provider = 'google';
        await user.save();
      }
    }

    // Generate our custom JWT
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d", // Longer expiration for magic link / google auth
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
