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
      { title },
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
      { body },
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
      { tags },
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
      { icon },
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
      { access },
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
      { deletedAt: new Date() },
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

    await promptModel.updateMany(
      { createdBy: userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
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

    // 1. Process Created
    if (payload.created && payload.created.length > 0) {
      for (const item of payload.created) {
        const createdAt = item.createdAt
          ? new Date(item.createdAt)
          : new Date();
        const updatedAt = item.updatedAt ? new Date(item.updatedAt) : createdAt;

        const prompt = await promptModel.create({
          createdBy: userId,
          clientTempId: item.clientTempId || "",
          title: item.title,
          body: item.body,
          tags: item.tags ?? [],
          icon: item.icon ?? "",
          access: item.access ?? "private",
          deletedAt: null,
          createdAt,
          updatedAt,
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

    // 2. Process Updated
    if (payload.updated && payload.updated.length > 0) {
      for (const item of payload.updated) {
        if (!item.promptId) continue;
        const existing = await promptModel.findOne({
          _id: item.promptId,
          createdBy: userId,
          deletedAt: null,
        });

        if (existing) {
          const clientUpdatedAt = item.updatedAt
            ? new Date(item.updatedAt)
            : new Date();
          // Last-Write-Wins: only update if client's updatedAt >= server's updatedAt
          if (clientUpdatedAt >= existing.updatedAt) {
            existing.title = item.title;
            existing.body = item.body;
            if (item.tags !== undefined) existing.tags = item.tags;
            if (item.icon !== undefined) existing.icon = item.icon;
            if (item.access !== undefined) existing.access = item.access;
            existing.updatedAt = clientUpdatedAt;
            await existing.save();
            appliedUpdated.push(item.promptId);
          }
        }
      }
    }

    // 3. Process Deleted
    if (payload.deletedIds && payload.deletedIds.length > 0) {
      for (const promptId of payload.deletedIds) {
        const prompt = await promptModel.findOneAndUpdate(
          { _id: promptId, createdBy: userId, deletedAt: null },
          { deletedAt: new Date() },
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

    // 4. Server Changes (changes that occurred on the server since lastSyncTimestamp)
    let serverPrompts: IPrompt[];
    let serverDeletedIds: string[] = [];

    if (payload.lastSyncTimestamp) {
      const syncDate = new Date(payload.lastSyncTimestamp);
      // Fetch active prompts modified since lastSyncTimestamp, excluding items created in this sync call
      const modifiedPrompts = await promptModel.find({
        createdBy: userId,
        _id: { $nin: newlyCreatedIds },
        updatedAt: { $gt: syncDate },
        deletedAt: null,
      });
      serverPrompts = modifiedPrompts;

      // Fetch prompts deleted on server since lastSyncTimestamp, excluding those deleted in this sync call
      const deletedPrompts = await promptModel.find({
        createdBy: userId,
        _id: { $nin: appliedDeleted },
        deletedAt: { $gt: syncDate, $ne: null },
      });
      serverDeletedIds = deletedPrompts.map((p) => p._id.toString());
    } else {
      // First sync: return all active prompts on the server excluding the ones created right now
      const allActive = await promptModel.find({
        createdBy: userId,
        _id: { $nin: newlyCreatedIds },
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
      syncTimestamp: new Date().toISOString(),
    };
  }
}
