import { ObjectId } from "mongoose";

export interface TUserArtist {
  userId: ObjectId;
  userRef: "User" | "Artist";
}
