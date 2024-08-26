import { model, Schema } from "mongoose";
import { TFavourite } from "./favourite.interface";

const favouriteSchema = new Schema<TFavourite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    favSongs: [{ type: Schema.Types.ObjectId, ref: "Song", default: [] }],
  },
  {
    timestamps: true,
  }
);

// Create the model
export const Favourite = model("Favourite", favouriteSchema);
