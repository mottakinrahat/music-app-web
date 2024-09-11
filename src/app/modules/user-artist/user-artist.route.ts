import express from "express";
import { UserArtistController } from "./user-artist.controller";
const router = express.Router();

//create user/artist
router.post("/:role", UserArtistController.createUserArtist);

export const userArtistRoute = router;
