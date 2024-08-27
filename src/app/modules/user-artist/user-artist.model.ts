import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { TUserArtist } from "./user-artist.interface";
import config from "../../config";

const userArtistSchema = new Schema<TUserArtist>(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      refPath: "userRef",
      required: [true, "User/Artist id is required"],
    },
    userRef: {
      type: String,
      enum: ["User", "Artist"],
      required: [true, "userRef name is required"],
    },
    role: {
      type: String,
      required: [true, "role name is required"],
    },
  },
  {
    timestamps: true,
  }
);

// password hashing
userArtistSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_url));

  next();
});
userArtistSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const UserArtist = model<TUserArtist>("UserArtist", userArtistSchema);
