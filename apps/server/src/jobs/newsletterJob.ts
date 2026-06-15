import cron from "node-cron";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import os from "os";
import Blog from "../models/Blog";
import Subscriber from "../models/Subscriber";
import EmailTask from "../models/EmailTask";

export const generatePDFFromBlogs = async (blogs: any[], title: string, fileNamePrefix: string): Promise<string> => {
  const uploadsDir = path.join(os.tmpdir(), "moonridge-newsletters");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${fileNamePrefix}_${Date.now()}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Add placeholder logo
      try {
        const logoUrl = "https://via.placeholder.com/150x50?text=MoonRidge";
        const res = await fetch(logoUrl);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          // To use 'align' center with pdfkit, we can just let it left align or manually set X
          // For simplicity, we just flow it inline.
          doc.image(Buffer.from(arrayBuffer), { width: 150 });
          doc.moveDown(2);
        }
      } catch (err) {
        console.warn("Could not load logo for PDF:", err);
      }

      doc.fontSize(24).text(title, { align: "center" });
      doc.moveDown();

      for (const blog of blogs) {
        doc.fontSize(18).fillColor("black").text(blog.title, { underline: true });
        doc.fontSize(12).fillColor("gray").text(`Category: ${blog.category} | ${new Date(blog.createdAt!).toDateString()}`);
        doc.moveDown(0.5);

        const imgUrl = blog.cover || blog.thumbnail;
        if (imgUrl) {
          try {
            const res = await fetch(imgUrl);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              doc.image(Buffer.from(arrayBuffer), { width: 400 });
              doc.moveDown(1);
            }
          } catch (err) {
            console.warn(`Could not load image for blog ${blog.title}`, err);
          }
        }

        doc.fillColor("black").fontSize(12).text(blog.excerpt || "Read more on our website!");
        doc.moveDown(2);
      }

      doc.end();

      writeStream.on("finish", () => {
        resolve(filePath);
      });

      writeStream.on("error", (err) => {
        console.error("PDF generation error:", err);
        reject(err);
      });
    } catch (err) {
      console.error("PDF generation layout error:", err);
      reject(err);
    }
  });
};

const generateNewsletterHTML = (blogs: any[], title: string): string => {
  const logoUrl = "https://via.placeholder.com/150x50?text=MoonRidge"; // placeholder
  const websiteUrl = "https://www.moonridgeadventure.com/";
  const packagesUrl = "https://www.moonridgeadventure.com/packages";
  const socialLinks = `
    <a href="#" style="margin: 0 10px; color: #4F46E5;">Facebook</a>
    <a href="#" style="margin: 0 10px; color: #4F46E5;">Instagram</a>
    <a href="#" style="margin: 0 10px; color: #4F46E5;">Twitter</a>
  `;

  let blogsHtml = blogs.map(blog => {
    const imgUrl = blog.cover || blog.thumbnail || "https://via.placeholder.com/400x200?text=No+Image";
    const blogUrl = `https://www.moonridgeadventure.com/blog/${blog.slug}`;
    return `
      <div style="margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
        <img src="${imgUrl}" alt="${blog.title}" style="width: 100%; max-width: 400px; border-radius: 8px; margin-bottom: 15px;" />
        <h3 style="margin: 0 0 10px 0; color: #111827;">${blog.title}</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">${blog.excerpt || "Read more on our website!"}</p>
        <a href="${blogUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Story</a>
      </div>
    `;
  }).join("");

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9fafb; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${logoUrl}" alt="MoonRidge Logo" style="max-width: 150px;" />
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #111827; text-align: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;">${title}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Here are the latest travel stories and adventures from MoonRidge. Get inspired for your next journey!</p>
        
        <div style="margin-top: 30px;">
          ${blogsHtml}
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
          <h3 style="color: #111827;">Ready for an adventure?</h3>
          <p style="color: #4b5563;">Check out our exclusive travel packages tailored just for you.</p>
          <a href="${packagesUrl}" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-top: 10px;">Explore Packages</a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
        <p>Follow us on our journey</p>
        <div>${socialLinks}</div>
        <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} <a href="${websiteUrl}" style="color: #6b7280; text-decoration: underline;">MoonRidge Adventure</a>. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const generateMonthlyNewsletterPDF = async (): Promise<{ pdfPath: string, blogs: any[] } | null> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const blogs = await Blog.find({
    status: "published",
    createdAt: { $gte: thirtyDaysAgo },
  }).sort({ createdAt: -1 });

  if (blogs.length === 0) {
    console.log("No new blogs in the last 30 days. Skipping newsletter.");
    return null;
  }

  const pdfPath = await generatePDFFromBlogs(blogs, "Monthly MoonRidge Newsletter", "newsletter");
  return { pdfPath, blogs };
};

// Queue a welcome email for a new subscriber
export const queueWelcomeEmail = async (email: string) => {
  try {
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 }).limit(5);
    if (blogs.length === 0) return;

    const pdfPath = await generatePDFFromBlogs(blogs, "Welcome to MoonRidge! Latest Stories", "welcome");
    const htmlContent = generateNewsletterHTML(blogs, "Welcome to MoonRidge! Here are our latest travel stories");

    const task = new EmailTask({
      to: email,
      subject: "Welcome to MoonRidge! Here are our latest travel stories",
      htmlContent,
      attachmentPath: pdfPath,
      status: "pending",
    });

    await task.save();
    console.log(`Queued welcome email for ${email}`);
    
    // Process queue asynchronously to send immediately
    processEmailQueue().catch(console.error);
  } catch (err) {
    console.error("Error queueing welcome email:", err);
  }
};

// Queue tasks for all subscribers
export const queueNewsletterTasks = async () => {
  try {
    const result = await generateMonthlyNewsletterPDF();
    if (!result) return; // No blogs to send
    const { pdfPath, blogs } = result;

    const htmlContent = generateNewsletterHTML(blogs, "Your Monthly MoonRidge Travel Newsletter");

    const subscribers = await Subscriber.find({ active: true });
    
    const tasks = subscribers.map((sub) => ({
      to: sub.email,
      subject: "Your Monthly MoonRidge Travel Newsletter",
      htmlContent,
      attachmentPath: pdfPath,
      status: "pending",
    }));

    if (tasks.length > 0) {
      await EmailTask.insertMany(tasks);
      console.log(`Queued ${tasks.length} newsletter emails.`);
    }
  } catch (error) {
    console.error("Error queuing newsletter tasks:", error);
  }
};

// Create a mail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
};

// Send queued emails
export const processEmailQueue = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS not set in .env. Skipping email processing.");
    return;
  }

  try {
    // Check daily limit (100 emails)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sentTodayCount = await EmailTask.countDocuments({
      status: "sent",
      sentAt: { $gte: startOfDay },
    });

    if (sentTodayCount >= 100) {
      console.log("Daily email limit of 100 reached. Skipping processing until tomorrow.");
      return;
    }

    // Limit to either 2 (the per-5-min limit) or the remaining daily allowance
    const remainingToday = 100 - sentTodayCount;
    const batchSize = Math.min(2, remainingToday);

    if (batchSize <= 0) return;

    const pendingTasks = await EmailTask.find({ status: "pending" }).limit(batchSize);

    if (pendingTasks.length === 0) {
      return; // Queue is empty
    }

    const transporter = createTransporter();

    const processedAttachments = new Set<string>();

    for (const task of pendingTasks) {
      try {
        await transporter.sendMail({
          from: `"MoonRidge Adventure" <${process.env.EMAIL_USER}>`,
          to: task.to,
          subject: task.subject,
          text: "Hello! Attached is your monthly roundup of the best travel stories from MoonRidge. Enjoy reading!",
          html: task.htmlContent,
          attachments: [
            {
              filename: "MoonRidge_Newsletter.pdf",
              path: task.attachmentPath,
            },
          ],
        });

        task.status = "sent";
        task.sentAt = new Date();
        await task.save();
        console.log(`Sent newsletter to ${task.to}`);
        processedAttachments.add(task.attachmentPath);
      } catch (err) {
        console.error(`Failed to send email to ${task.to}:`, err);
        task.status = "failed";
        await task.save();
        processedAttachments.add(task.attachmentPath);
      }
    }

    // Clean up attachments that are no longer needed
    for (const attachmentPath of processedAttachments) {
      try {
        const pendingCount = await EmailTask.countDocuments({ attachmentPath, status: "pending" });
        if (pendingCount === 0) {
          if (fs.existsSync(attachmentPath)) {
            fs.unlinkSync(attachmentPath);
            console.log(`Deleted unused attachment: ${attachmentPath}`);
          }
        }
      } catch (cleanupErr) {
        console.error(`Error cleaning up attachment ${attachmentPath}:`, cleanupErr);
      }
    }
  } catch (error) {
    console.error("Error processing email queue:", error);
  }
};

// Initialize Cron Jobs
export const initCronJobs = () => {
  console.log("Initializing Cron Jobs...");

  // Run Monthly at 00:00 on the 1st of every month
  cron.schedule("0 0 1 * *", () => {
    console.log("Running Monthly Newsletter Generator...");
    queueNewsletterTasks();
  });

  // Run every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    processEmailQueue();
  });
};
