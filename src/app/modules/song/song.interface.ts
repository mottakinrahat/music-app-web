import { ObjectId } from "mongoose";

interface Lyric {
  startTime: string;
  endTime: string;
  line: string;
}

export interface TSong {
  songName: string;
  artwork: string;
  songArtist: string;
  songLink: string;
  songAlbum: ObjectId;
  songDuration: string;
  releaseYear: number;
  genre: string;
  category: ObjectId;
  lyrics: Lyric[];
  isFavourite: boolean;
  isPlayList: boolean;
  album: ObjectId;
}
