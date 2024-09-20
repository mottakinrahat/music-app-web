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
<<<<<<< HEAD
  songImage:string;
  songLink:string;
=======
  songLink: string;
>>>>>>> c80c9edb5df76016c1060286975619c3dab3ae79
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
