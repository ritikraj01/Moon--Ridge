import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin";

export const firebaseAuth = async (req: Request, res: Response) => {
  try {
    const { idToken, provider } = req.body;

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
        provider: provider || 'email',
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
        user.provider = provider || 'email';
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
    console.error("Firebase auth error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
