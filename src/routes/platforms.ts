import { Router } from "express";
import platformsManifestJson from "../data/platforms-manifest.json" with { type: "json" };
import type { PlatformsManifest } from "../types/platform.types.ts";

const platformsRouter: Router = Router();
const platformsManifest = platformsManifestJson as PlatformsManifest;

platformsRouter.get("/manifest", (_req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400",
  );
  return res.status(200).json(platformsManifest);
});

export default platformsRouter;
