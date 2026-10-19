import { Schema, model, type Document, type Types } from "mongoose";
export type accessType = "public" | "private" | "link";

export interface IPromptDocument extends Document {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  title: string;
  body: string;
  icon: string;
  tags: string[];
  likes: number;
  downloads: number;
  access: accessType;
  createdAt: Date;
  updatedAt: Date;
}

export const promptSchema = new Schema<IPromptDocument>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    icon: { type: String, required: false, default: "" },
    tags: { type: [{ type: String }], default: [] },
    likes: { type: Number, required: true, default: 0 },
    downloads: { type: Number, required: true, default: 0 },
    access: {
      type: String,
      enum: ["public", "private", "link"],
      required: true,
      default: "private",
    },
  },
  { timestamps: true },
);

export const promptModel = model<IPromptDocument>("PromptModel", promptSchema);
