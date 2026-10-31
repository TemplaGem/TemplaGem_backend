import { Schema, model, type Document, type Types } from "mongoose";
export type accessType = "public" | "private" | "link";

export interface IPromptDocument extends Document {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  clientTempId?: string | undefined;
  title: string;
  body: string;
  icon: string;
  tags: string[];
  likes: number;
  downloads: number;
  access: accessType;
  deletedAt?: Date | null | undefined;
  clientUpdatedAt?: Date | undefined;
  serverUpdatedAt: Date;
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
    clientTempId: { type: String, required: false },
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
    deletedAt: { type: Date, default: null, index: true },
    clientUpdatedAt: { type: Date, default: null },
    serverUpdatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

// User-scoped unique index for idempotent creation by clientTempId
promptSchema.index(
  { createdBy: 1, clientTempId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      clientTempId: { $type: "string", $gt: "" },
      deletedAt: null,
    },
  },
);

promptSchema.index({ createdBy: 1, serverUpdatedAt: 1 });

export const promptModel = model<IPromptDocument>("PromptModel", promptSchema);
