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
} from "../types/prompt.types.ts";
import { promptModel } from "../models/prompt-model.ts";
import { userModel } from "../models/user-model.ts";

export class PromptService {
  async getPrompts(userId: Types.ObjectId | string): Promise<IPrompt[]> {
    if (!userId) {
      throw new Error("User ID is required.");
    }
    return promptModel.find({ createdBy: userId }).sort({ createdAt: -1 });
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
      { _id: promptId, createdBy: userId },
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
      { _id: promptId, createdBy: userId },
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
      { _id: promptId, createdBy: userId },
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
      { _id: promptId, createdBy: userId },
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
      { _id: promptId, createdBy: userId },
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

    const prompt = await promptModel.findOneAndDelete({
      _id: promptId,
      createdBy: userId,
    });

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

    await promptModel.deleteMany({ createdBy: userId });
    await userModel.findByIdAndUpdate(userId, {
      $set: { prompts: [] },
    });
  }
}
