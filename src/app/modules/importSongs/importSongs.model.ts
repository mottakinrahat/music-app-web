import { model, Schema } from "mongoose";
import { TImportSongs } from "./importSongs.interface";

// Define the schema
const importSongSchema = new Schema<TImportSongs>(
  {
    songName: {
      type: String,
      required: [true, "song name is required"],
    },
    songLink: {
      type: String,
      required: [true, "song link is required"],
    },
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
export const ImportSong = model<TImportSongs>("Import", importSongSchema);
