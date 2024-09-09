import { ObjectId } from "mongoose";

export interface TImportSongs {
  songName: string;
  userId: ObjectId;
  songLink: string;
}
