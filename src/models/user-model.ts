import { Schema, model } from "mongoose";
import type { IUser } from "../types/user.types.ts";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredAt: { type: Date, required: true, default: Date.now },
  prompts: [
    {
      type: Schema.Types.ObjectId,
      ref: "PromptModel",
    },
  ],
  rating: { type: Number, required: true, default: 0 },
});

export const userModel = model<IUser>("UserModel", userSchema);
