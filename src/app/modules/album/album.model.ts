import { model, Schema } from "mongoose";
import { TAlbum } from "./album.interface";

// Define the schema
const albumSchema = new Schema<TAlbum>(
  {
    albumName: {
      type: String,
      required: [true, "album name is required"],
    },
    previouslyReleased: {
      type: Boolean,
      default: false,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: [true, "artist name is required"],
    },
    label: {
      type: String,
      required: [true, "Name of the record laebl is required"],
    },
    genre: {
      type: String,
      required: [true, "genre is required"],
    },
    subGenre: {
      type: String,
      required: [true, "sub-genre is required"],
    },
    releasedDate: {
      type: Date,
      default: Date.now(),
    },
    isReleased: {
      type: Boolean,
      default: false,
    },
    songs: {
      type: Array,
      ref: "Song",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
export const Album = model("Album", albumSchema);
