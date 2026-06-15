import mongoose, { Document, Schema } from "mongoose";

export interface IEmailTask extends Document {
  to: string;
  subject: string;
  htmlContent?: string;
  attachmentPath: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
  createdAt: Date;
}

const emailTaskSchema = new Schema<IEmailTask>(
  {
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
    },
    attachmentPath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmailTask || mongoose.model<IEmailTask>("EmailTask", emailTaskSchema);
