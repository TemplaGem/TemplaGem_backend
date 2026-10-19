import { Router } from "express";
import { PromptService } from "../services/prompt.services.ts";
import protect from "../middleware/protect.ts";
import {
  createPromptSchema,
  updatePromptTitleSchema,
  updatePromptBodySchema,
  updatePromptTagsSchema,
  updatePromptIconSchema,
  deletePromptSchema,
} from "../validation/prompt-validation.ts";

const promptsRouter: Router = Router();
const promptService = new PromptService();

promptsRouter.get("/", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const prompts = await promptService.getPrompts(userId);
    return res.status(200).json({ prompts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch prompts";
    return res.status(400).json({ error: message });
  }
});

promptsRouter.post("/create", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const validation = createPromptSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { title, body, tags, icon } = validation.data;
    await promptService.createPrompt({ userId, title, body, tags, icon });
    return res.status(201).json({ message: "Prompt created successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create prompt";
    return res.status(400).json({ error: message });
  }
});

promptsRouter.patch("/change/title", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const validation = updatePromptTitleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { promptId, title } = validation.data;
    await promptService.updatePromptTitle({ userId, promptId, title });
    return res
      .status(200)
      .json({ message: "Prompt title updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update prompt title";
    const status = message === "Prompt not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

promptsRouter.delete("/delete", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const validation = deletePromptSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { promptId } = validation.data;
    await promptService.deletePrompt({ userId, promptId });
    return res.status(200).json({ message: "Prompt deleted successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete prompt";
    const status = message === "Prompt not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

promptsRouter.delete("/delete/all", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    await promptService.deleteAllPrompts(userId);
    return res
      .status(200)
      .json({ message: "All prompts deleted successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete all prompts";
    const status = message === "User not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

promptsRouter.patch("/change/body", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const validation = updatePromptBodySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { promptId, body } = validation.data;
    await promptService.updatePromptBody({ userId, promptId, body });
    return res
      .status(200)
      .json({ message: "Prompt body updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update prompt body";
    const status = message === "Prompt not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

promptsRouter.patch("/change/tags", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const validation = updatePromptTagsSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { promptId, tags } = validation.data;
    await promptService.updatePromptTags({ userId, promptId, tags });
    return res
      .status(200)
      .json({ message: "Prompt tags updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update prompt tags";
    const status = message === "Prompt not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

promptsRouter.patch("/change/icon", protect, async (req, res) => {
  try {
    const userId = req.user!._id!;
    const validation = updatePromptIconSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { promptId, icon } = validation.data;
    await promptService.updatePromptIcon({ userId, promptId, icon });
    return res
      .status(200)
      .json({ message: "Prompt icon updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update prompt icon";
    const status = message === "Prompt not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

export default promptsRouter;
