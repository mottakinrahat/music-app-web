import express from "express";
import { artistController } from "./artist.controller";

const router = express.Router();

router.get("/", artistController.getAritsts);
router.put("/:id", artistController.updateArtist);
router.delete("/:id", artistController.deletedArtist);

export const artistRoutes = router;
