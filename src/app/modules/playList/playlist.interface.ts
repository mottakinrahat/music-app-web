import { ObjectId } from "mongoose";

export interface TPlaylist {
  playListName: string;
  userId: ObjectId;
  playListSongs: ObjectId[];
}
