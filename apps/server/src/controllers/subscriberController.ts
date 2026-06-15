import { Request, Response } from "express";
import Subscriber from "../models/Subscriber";
import { queueWelcomeEmail } from "../jobs/newsletterJob";

export const addSubscriber = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        // Send welcome back email with latest blogs
        queueWelcomeEmail(existing.email);
      }
      return res.status(200).json({ message: "Subscribed successfully" });
    }

    const subscriber = new Subscriber({ email: email.toLowerCase() });
    await subscriber.save();

    // Send welcome email with latest blogs
    queueWelcomeEmail(subscriber.email);

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
