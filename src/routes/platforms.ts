import { Router } from "express";
import { platformsManifest } from "../data/platforms-manifest.ts";

const platformsRouter: Router = Router();

platformsRouter.get("/manifest", (_req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400",
  );
  return res.status(200).json(platformsManifest);
});

export default platformsRouter;
