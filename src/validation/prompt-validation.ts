import { z } from "zod";

const promptIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Prompt ID must be a valid MongoDB ObjectId");

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title must be at most 100 characters long");

const bodySchema = z
  .string()
  .trim()
  .min(1, "Body is required")
  .max(10000, "Body must be at most 10000 characters long");

const tagsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Tag cannot be empty")
      .max(30, "Tag must be at most 30 characters long"),
  )
  .max(10, "A prompt can have at most 10 tags");

const nonEmptyIconSchema = z.string().trim().min(1, "Icon cannot be empty");

const iconSchema = z
  .string()
  .trim()
  .max(100, "Icon must be at most 100 characters long");

export const createPromptSchema = z.object({
  title: titleSchema,
  body: bodySchema,
  tags: tagsSchema.optional().default([]),
  icon: iconSchema.optional(),
});

export const updatePromptTitleSchema = z.object({
  promptId: promptIdSchema,
  title: titleSchema,
});

export const updatePromptBodySchema = z.object({
  promptId: promptIdSchema,
  body: bodySchema,
});

export const updatePromptTagsSchema = z.object({
  promptId: promptIdSchema,
  tags: tagsSchema,
});

export const updatePromptIconSchema = z.object({
  promptId: promptIdSchema,
  icon: nonEmptyIconSchema,
});

export const deletePromptSchema = z.object({
  promptId: promptIdSchema,
});

export const syncPromptItemSchema = z.object({
  clientTempId: z.string().trim().min(1).optional(),
  promptId: promptIdSchema.optional(),
  title: titleSchema,
  body: bodySchema,
  tags: tagsSchema.optional(),
  icon: iconSchema.optional(),
  access: z.enum(["public", "private", "link"]).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const syncPromptsSchema = z.object({
  lastSyncTimestamp: z.string().datetime().nullable().optional(),
  created: z
    .array(syncPromptItemSchema)
    .max(250, "Batch cannot exceed 250 created items")
    .optional()
    .default([]),
  updated: z
    .array(syncPromptItemSchema)
    .max(250, "Batch cannot exceed 250 updated items")
    .optional()
    .default([]),
  deletedIds: z
    .array(promptIdSchema)
    .max(500, "Batch cannot exceed 500 deleted IDs")
    .optional()
    .default([]),
});
