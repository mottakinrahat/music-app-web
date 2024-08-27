import { model, Schema } from "mongoose";
import { TUserArtist } from "./user-artist.interface";

const userArtistSchema = new Schema<TUserArtist>(
  {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      refPath: "userRef",
      required: [true, "User/Artist id is required"],
    },
    userRef: {
      type: String,
      required: true,
      enum: ["User", "Artist"],
    },
  },
  {
    timestamps: true,
  }
);

export const UserArtist = model<TUserArtist>("UserArtist", userArtistSchema);
