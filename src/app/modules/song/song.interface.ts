import { ObjectId } from "mongoose";
import { Buffer } from "buffer";

// interface Lyric {
//   startTime: string;
//   endTime: string;
//   line: string;
// }

export interface TSong {
  songName: string;
  artwork: string;
  songArtist: string;
  songLink: Buffer;
  songAlbum: ObjectId;
  songDuration: string;
  releaseYear: number;
  genre: string;
  bpm: number;
  category: ObjectId;
  // lyrics: Lyric[];
  lyrics: string;
  favUsers: ObjectId;
  playListUsers: ObjectId;
  album: ObjectId;
}
