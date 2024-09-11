import { ObjectId } from "mongoose";

export interface TImportSongs {
  songName: string;
  userId: ObjectId | string;
  songLink: string;
}
