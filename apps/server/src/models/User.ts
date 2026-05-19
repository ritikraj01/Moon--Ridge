import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  phone?: string;
  firebaseUid: string;
  provider: 'email' | 'google';
  avatar?: string;
  role: "user" | "admin";
  bookings: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    firebaseUid: { type: String, required: true, unique: true },
    provider: { type: String, enum: ['email', 'google'], required: true },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
