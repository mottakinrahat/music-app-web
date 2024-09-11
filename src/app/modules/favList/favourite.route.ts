import express from "express";
import { favouriteController } from "./favourite.controller";

const router = express.Router();

router.get("/:id", favouriteController.getFavouriteSongs);
router.put("/:id/:userId", favouriteController.favHandler);

export const favoriteRoute = router;
