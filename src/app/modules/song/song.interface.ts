import { ObjectId } from "mongoose";

// interface Lyric {
//   startTime: string;
//   endTime: string;
//   line: string;
// }

export interface TSong {
  songName: string;
  artwork: string;
  songArtist: string;
  songLink: string;
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
