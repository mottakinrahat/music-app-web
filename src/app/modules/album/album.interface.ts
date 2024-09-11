import { ObjectId } from "mongoose";

export interface TAlbum {
  albumName: string;
  previouslyReleased: boolean;
  label: string;
  subGenre: string;
  albumImage: string;
  artistId: ObjectId;
  releasedDate: Date;
  isReleased: boolean;
  songs: ObjectId;
  genre: string;
}
