import express from "express";
import { UserArtistController } from "./user-artist.controller";
const router = express.Router();

router.post("/:role", UserArtistController.createUserArtist);
router.get("/", UserArtistController.getUserArtist);
export const userArtistRoute = router;
