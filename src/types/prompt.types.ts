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
  _id?: Types.ObjectId | string | undefined;
  createdBy?: Types.ObjectId | string | undefined;
  clientTempId?: string | undefined;
  title: string;
  body: string;
  icon?: string | undefined;
  tags: string[];
  likes?: number | undefined;
  downloads?: number | undefined;
  access?: accessType | undefined;
  deletedAt?: Date | null | undefined;
  clientUpdatedAt?: Date | undefined;
  serverUpdatedAt?: Date | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface SyncPromptItemDto {
  clientTempId?: string | undefined;
  promptId?: string | undefined;
  title: string;
  body: string;
  tags?: string[] | undefined;
  icon?: string | undefined;
  access?: accessType | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}

export interface SyncPromptsPayloadDto {
  lastSyncTimestamp?: string | null | undefined;
  created?: SyncPromptItemDto[] | undefined;
  updated?: SyncPromptItemDto[] | undefined;
  deletedIds?: string[] | undefined;
}

export interface SyncCreatedResultItem {
  clientTempId?: string | undefined;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncPromptsResultDto {
  applied: {
    created: SyncCreatedResultItem[];
    updated: string[];
    deleted: string[];
  };
  serverChanges: {
    prompts: IPrompt[];
    deletedIds: string[];
  };
  syncTimestamp: string;
}

// Backwards-compatible aliases for legacy imports if any
export type CreatePromptBody = CreatePromptDto;
export type UpdatePromptTitle = UpdatePromptTitleDto;
export type UpdatePromptBody = UpdatePromptBodyDto;
export type UpdatePromptTags = UpdatePromptTagsDto;
export type UpdatePromptIcon = UpdatePromptIconDto;
export type UpdatePromptAccess = UpdatePromptAccessDto;
export type DeletePrompt = DeletePromptDto;
