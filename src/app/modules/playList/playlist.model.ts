import { model, Schema } from "mongoose";
import { TPlaylist } from "./playlist.interface";

const playlistSchema = new Schema<TPlaylist>(
  {
    playListName: {
      type: String,
      required: [true, "Play List Name is Required!"],
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    playListSongs: [{ type: Schema.Types.ObjectId, ref: "Song", default: [] }],
  },
  {
    timestamps: true,
  }
);

// Create the model
export const Playlist = model("Playlist", playlistSchema);
