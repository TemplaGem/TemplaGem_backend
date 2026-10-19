import type { Types } from "mongoose";
import type { accessType } from "../models/prompt-model.ts";

export interface CreatePromptDto {
  userId: Types.ObjectId | string;
  title: string;
  body: string;
  tags?: string[] | undefined;
  icon?: string | undefined;
  access?: accessType | undefined;
}

export interface UpdatePromptTitleDto {
  userId: Types.ObjectId | string;
  promptId: string;
  title: string;
}

export interface UpdatePromptBodyDto {
  userId: Types.ObjectId | string;
  promptId: string;
  body: string;
}

export interface UpdatePromptTagsDto {
  userId: Types.ObjectId | string;
  promptId: string;
  tags: string[];
}

export interface UpdatePromptIconDto {
  userId: Types.ObjectId | string;
  promptId: string;
  icon: string;
}

export interface UpdatePromptAccessDto {
  userId: Types.ObjectId | string;
  promptId: string;
  access: accessType;
}

export interface DeletePromptDto {
  userId: Types.ObjectId | string;
  promptId: string;
}

export interface IPrompt {
  _id?: Types.ObjectId | string;
  createdBy?: Types.ObjectId | string;
  title: string;
  body: string;
  icon?: string;
  tags: string[];
  likes?: number;
  downloads?: number;
  access?: accessType;
  createdAt?: Date;
  updatedAt?: Date;
}

// Backwards-compatible aliases for legacy imports if any
export type CreatePromptBody = CreatePromptDto;
export type UpdatePromptTitle = UpdatePromptTitleDto;
export type UpdatePromptBody = UpdatePromptBodyDto;
export type UpdatePromptTags = UpdatePromptTagsDto;
export type UpdatePromptIcon = UpdatePromptIconDto;
export type UpdatePromptAccess = UpdatePromptAccessDto;
export type DeletePrompt = DeletePromptDto;
