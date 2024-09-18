import { ObjectId } from "mongoose";

export interface TFavourite {
  userId: ObjectId;
  favSongs: ObjectId[];
}
