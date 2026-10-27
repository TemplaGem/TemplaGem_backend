import type { Types } from "mongoose";
import type {
  CreatePromptDto,
  UpdatePromptBodyDto,
  UpdatePromptTitleDto,
  UpdatePromptTagsDto,
  UpdatePromptIconDto,
  UpdatePromptAccessDto,
  DeletePromptDto,
  IPrompt,
  SyncPromptsPayloadDto,
  SyncPromptsResultDto,
  SyncCreatedResultItem,
} from "../types/prompt.types.ts";
import { promptModel } from "../models/prompt-model.ts";
import { userModel } from "../models/user-model.ts";

export class PromptService {
  async getPrompts(userId: Types.ObjectId | string): Promise<IPrompt[]> {
    if (!userId) {
      throw new Error("User ID is required.");
    }
    return promptModel
      .find({ createdBy: userId, deletedAt: null })
      .sort({ createdAt: -1 });
  }

  async createPrompt(createPromptData: CreatePromptDto): Promise<IPrompt> {
    const { userId, title, body, tags, icon, access } = createPromptData;
    if (!userId || !title || !body) {
      throw new Error("User ID, title and body are required.");
    }

    const prompt = await promptModel.create({
      createdBy: userId,
      title,
      body,
      tags: tags ?? [],
      icon: icon ?? "",
      access: access ?? "private",
      deletedAt: null,
      serverUpdatedAt: new Date(),
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { prompts: prompt._id },
    });

    return prompt;
  }

  async updatePromptTitle(
    updatePromptTitleData: UpdatePromptTitleDto,
  ): Promise<void> {
    const { userId, promptId, title } = updatePromptTitleData;
    if (!userId || !promptId || !title) {
      throw new Error("Prompt ID, user ID and title are required.");
    }

    const prompt = await promptModel.findOneAndUpdate(
      { _id: promptId, createdBy: userId, deletedAt: null },
      { title, serverUpdatedAt: new Date() },
      { new: true },
    );

    if (!prompt) {
      throw new Error("Prompt not found.");
    }
  }

  async updatePromptBody(
    updatePromptBodyData: UpdatePromptBodyDto,
  ): Promise<void> {
    const { userId, promptId, body } = updatePromptBodyData;
    if (!userId || !promptId || !body) {
      throw new Error("User ID, prompt ID and body are required.");
    }

    const prompt = await promptModel.findOneAndUpdate(
      { _id: promptId, createdBy: userId, deletedAt: null },
      { body, serverUpdatedAt: new Date() },
      { new: true },
    );

    if (!prompt) {
      throw new Error("Prompt not found.");
    }
  }

  async updatePromptTags(
    updatePromptTagsData: UpdatePromptTagsDto,
  ): Promise<void> {
    const { userId, promptId, tags } = updatePromptTagsData;
    if (!userId || !promptId || !tags) {
      throw new Error("Prompt ID, user ID and tags are required.");
    }

    const prompt = await promptModel.findOneAndUpdate(
      { _id: promptId, createdBy: userId, deletedAt: null },
      { tags, serverUpdatedAt: new Date() },
      { new: true },
    );

    if (!prompt) {
      throw new Error("Prompt not found.");
    }
  }

  async updatePromptIcon(
    updatePromptIconData: UpdatePromptIconDto,
  ): Promise<void> {
    const { userId, promptId, icon } = updatePromptIconData;
    if (!userId || !promptId || !icon) {
      throw new Error("Prompt ID, user ID and icon are required.");
    }

    const prompt = await promptModel.findOneAndUpdate(
      { _id: promptId, createdBy: userId, deletedAt: null },
      { icon, serverUpdatedAt: new Date() },
      { new: true },
    );

    if (!prompt) {
      throw new Error("Prompt not found.");
    }
  }

  async updatePromptAccess(
    updatePromptAccessData: UpdatePromptAccessDto,
  ): Promise<void> {
    const { userId, promptId, access } = updatePromptAccessData;
    if (!userId || !promptId || !access) {
      throw new Error("Prompt ID, user ID and access are required.");
    }

    const prompt = await promptModel.findOneAndUpdate(
      { _id: promptId, createdBy: userId, deletedAt: null },
      { access, serverUpdatedAt: new Date() },
      { new: true },
    );

    if (!prompt) {
      throw new Error("Prompt not found.");
    }
  }

  async deletePrompt(deletePromptData: DeletePromptDto): Promise<void> {
    const { userId, promptId } = deletePromptData;
    if (!userId || !promptId) {
      throw new Error("User ID and prompt ID are required.");
    }

    const prompt = await promptModel.findOneAndUpdate(
      {
        _id: promptId,
        createdBy: userId,
        deletedAt: null,
      },
      { deletedAt: new Date(), serverUpdatedAt: new Date() },
      { new: true },
    );

    if (!prompt) {
      throw new Error("Prompt not found.");
    }

    await userModel.findByIdAndUpdate(userId, {
      $pull: { prompts: promptId },
    });
  }

  async deleteAllPrompts(userId: Types.ObjectId | string): Promise<void> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const now = new Date();
    await promptModel.updateMany(
      { createdBy: userId, deletedAt: null },
      { $set: { deletedAt: now, serverUpdatedAt: now } },
    );

    await userModel.findByIdAndUpdate(userId, {
      $set: { prompts: [] },
    });
  }

  async syncPrompts(
    userId: Types.ObjectId | string,
    payload: SyncPromptsPayloadDto,
  ): Promise<SyncPromptsResultDto> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const appliedCreated: SyncCreatedResultItem[] = [];
    const appliedUpdated: string[] = [];
    const appliedDeleted: string[] = [];
    const newlyCreatedIds: string[] = [];

    // Stable read boundary for cursor generation
    const readBoundaryTimestamp = new Date();

    // 1. Process Created (Idempotent creation via clientTempId)
    if (payload.created && payload.created.length > 0) {
      for (const item of payload.created) {
        const clientCreatedAt = item.createdAt
          ? new Date(item.createdAt)
          : new Date();
        const clientUpdatedAt = item.updatedAt
          ? new Date(item.updatedAt)
          : clientCreatedAt;
        const now = new Date();

        if (item.clientTempId && item.clientTempId.trim() !== "") {
          // Check if already created by this clientTempId (idempotent retry)
          const existing = await promptModel.findOne({
            createdBy: userId,
            clientTempId: item.clientTempId,
          });

          if (existing) {
            const serverId = existing._id.toString();
            newlyCreatedIds.push(serverId);
            appliedCreated.push({
              clientTempId: item.clientTempId,
              serverId,
              createdAt: existing.createdAt,
              updatedAt: existing.updatedAt,
            });
            continue;
          }
        }

        const prompt = await promptModel.create({
          createdBy: userId,
          clientTempId: item.clientTempId || "",
          title: item.title,
          body: item.body,
          tags: item.tags ?? [],
          icon: item.icon ?? "",
          access: item.access ?? "private",
          deletedAt: null,
          clientUpdatedAt,
          serverUpdatedAt: now,
          createdAt: clientCreatedAt,
          updatedAt: clientUpdatedAt,
        });

        await userModel.findByIdAndUpdate(userId, {
          $push: { prompts: prompt._id },
        });

        const serverId = prompt._id.toString();
        newlyCreatedIds.push(serverId);
        appliedCreated.push({
          clientTempId: item.clientTempId,
          serverId,
          createdAt: prompt.createdAt,
          updatedAt: prompt.updatedAt,
        });
      }
    }

    // 2. Process Updated (Atomic conditional LWW update preserving client edit time)
    if (payload.updated && payload.updated.length > 0) {
      for (const item of payload.updated) {
        if (!item.promptId) continue;
        const clientUpdatedAt = item.updatedAt
          ? new Date(item.updatedAt)
          : new Date();
        const now = new Date();

        const updateFields: Record<string, unknown> = {
          title: item.title,
          body: item.body,
          clientUpdatedAt,
          serverUpdatedAt: now,
          updatedAt: clientUpdatedAt,
        };
        if (item.tags !== undefined) updateFields.tags = item.tags;
        if (item.icon !== undefined) updateFields.icon = item.icon;
        if (item.access !== undefined) updateFields.access = item.access;

        // Atomically update only if document exists and clientUpdatedAt >= stored clientUpdatedAt / updatedAt
        const updatedPrompt = await promptModel.findOneAndUpdate(
          {
            _id: item.promptId,
            createdBy: userId,
            deletedAt: null,
            $or: [
              { clientUpdatedAt: null },
              { clientUpdatedAt: { $exists: false } },
              { clientUpdatedAt: { $lte: clientUpdatedAt } },
              {
                clientUpdatedAt: null,
                updatedAt: { $lte: clientUpdatedAt },
              },
            ],
          },
          { $set: updateFields },
          { new: true },
        );

        if (updatedPrompt) {
          appliedUpdated.push(item.promptId);
        }
      }
    }

    // 3. Process Deleted
    if (payload.deletedIds && payload.deletedIds.length > 0) {
      const now = new Date();
      for (const promptId of payload.deletedIds) {
        const prompt = await promptModel.findOneAndUpdate(
          { _id: promptId, createdBy: userId, deletedAt: null },
          { deletedAt: now, serverUpdatedAt: now },
          { new: true },
        );
        if (prompt) {
          await userModel.findByIdAndUpdate(userId, {
            $pull: { prompts: promptId },
          });
          appliedDeleted.push(promptId);
        }
      }
    }

    // 4. Server Changes (delta based on serverUpdatedAt up to readBoundaryTimestamp)
    let serverPrompts: IPrompt[];
    let serverDeletedIds: string[] = [];

    if (payload.lastSyncTimestamp) {
      const syncDate = new Date(payload.lastSyncTimestamp);

      // Active prompts modified on server since lastSyncTimestamp up to readBoundaryTimestamp
      const modifiedPrompts = await promptModel.find({
        createdBy: userId,
        _id: { $nin: newlyCreatedIds },
        serverUpdatedAt: { $gt: syncDate, $lte: readBoundaryTimestamp },
        deletedAt: null,
      });
      serverPrompts = modifiedPrompts;

      // Prompts deleted on server since lastSyncTimestamp up to readBoundaryTimestamp
      const deletedPrompts = await promptModel.find({
        createdBy: userId,
        _id: { $nin: appliedDeleted },
        deletedAt: { $ne: null },
        serverUpdatedAt: { $gt: syncDate, $lte: readBoundaryTimestamp },
      });
      serverDeletedIds = deletedPrompts.map((p) => p._id.toString());
    } else {
      // Initial sync: return all active prompts on the server up to readBoundaryTimestamp
      const allActive = await promptModel.find({
        createdBy: userId,
        _id: { $nin: newlyCreatedIds },
        serverUpdatedAt: { $lte: readBoundaryTimestamp },
        deletedAt: null,
      });
      serverPrompts = allActive;
    }

    return {
      applied: {
        created: appliedCreated,
        updated: appliedUpdated,
        deleted: appliedDeleted,
      },
      serverChanges: {
        prompts: serverPrompts,
        deletedIds: serverDeletedIds,
      },
      syncTimestamp: readBoundaryTimestamp.toISOString(),
    };
  }
}
