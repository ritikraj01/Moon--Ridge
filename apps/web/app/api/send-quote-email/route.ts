import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, tripDetails } = body;

    const adminEmails = process.env.ADMIN_EMAILS;
    if (!adminEmails) {
      return NextResponse.json(
        { error: "Admin emails not configured." },
        { status: 500 }
      );
    }

    const { duration, travelers, hotelType, transport, estimatedPrice } =
      tripDetails;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MoonRidge Adventure" <${process.env.EMAIL_USER}>`,
      to: adminEmails.split(',').map(e => e.trim()),
      subject: `🏔️ New Custom Trip Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d0d0d; color: #e5e5e5; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 40px auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; color: #000; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 8px 0 0; color: #1a1a1a; font-size: 14px; opacity: 0.85; }
            .body { padding: 36px 40px; }
            .section-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #f59e0b; margin: 0 0 12px; }
            .info-card { background: #242424; border-radius: 10px; padding: 20px 24px; margin-bottom: 20px; border: 1px solid #2e2e2e; }
            .info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #2e2e2e; }
            .info-row:last-child { border-bottom: none; }
            .info-label { color: #888; font-size: 13px; }
            .info-value { color: #f5f5f5; font-size: 14px; font-weight: 600; text-align: right; }
            .badge { display: inline-block; background: #f59e0b22; color: #f59e0b; border: 1px solid #f59e0b55; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
            .price-block { background: linear-gradient(135deg, #f59e0b18, #d9770608); border: 1px solid #f59e0b44; border-radius: 12px; padding: 24px; text-align: center; margin-top: 24px; }
            .price-label { font-size: 12px; color: #aaa; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 1px; }
            .price-value { font-size: 36px; font-weight: 800; color: #f59e0b; margin: 0; }
            .footer { background: #111; padding: 20px 40px; text-align: center; }
            .footer p { margin: 0; font-size: 12px; color: #555; }
            .footer span { color: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🏔️ New Custom Trip Request</h1>
              <p>Someone wants a personalized Spiti Valley experience</p>
            </div>

            <div class="body">
              <p class="section-title">Customer Details</p>
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Full Name</span>
                  <span class="info-value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email</span>
                  <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone</span>
                  <span class="info-value">${phone}</span>
                </div>
              </div>

              <p class="section-title">Trip Configuration</p>
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Duration</span>
                  <span class="info-value">${duration} Days</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Travelers</span>
                  <span class="info-value">${travelers} ${Number(travelers) === 1 ? "Person" : "People"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Hotel Type</span>
                  <span class="info-value"><span class="badge">${hotelType}</span></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Transport</span>
                  <span class="info-value"><span class="badge">${transport}</span></span>
                </div>
              </div>

              <div class="price-block">
                <p class="price-label">Estimated Price</p>
                <p class="price-value">₹${estimatedPrice}</p>
              </div>
            </div>

            <div class="footer">
              <p>This request was submitted via <span>Moon Ridge</span> — Build Your Trip page.</p>
              <p style="margin-top:6px;">Please follow up with the customer within 24 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
