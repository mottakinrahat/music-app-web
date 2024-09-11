import { model, Schema } from "mongoose";
import { TArtist } from "./artist.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const expertiseSchema = new Schema(
  {
    value: {
      type: String,
      required: [true, "expertise value is required"],
    },
    label: {
      type: String,
      required: [true, "expertise label is required"],
    },
  },
  { _id: false }
);

const proficiencySchema = new Schema(
  {
    value: {
      type: String,
      required: [true, "proficiency value is required"],
    },
    label: {
      type: String,
      required: [true, "proficiency label is required"],
    },
  },
  { _id: false }
);

const musicSchema = new Schema(
  {
    musicLink: {
      type: String,
      required: [true, "music link is required"],
    },
  },
  { _id: false }
);

// Define the schema
const artistSchema = new Schema<TArtist>(
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
      unique: true,
    },
    expertise: {
      type: [expertiseSchema],
      required: true,
    },
    proficiency: {
      type: [proficiencySchema],
      required: true,
    },
    music: {
      type: [musicSchema],
      required: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    portfolio: {
      type: String,
      required: [true, "portfolio is required"],
    },
    artistImage: {
      type: String,
      default: "",
    },
    albums: {
      type: Array,
      ref: "Album",
      default: [],
    },
    role: {
      type: String,
      default: "artist",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// password hashing
artistSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const artist = this;
  artist.password = await bcrypt.hash(
    artist.password,
    Number(config.bcrypt_url)
  );
  next();
});
artistSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Create the model
export const Artist = model<TArtist>("Artist", artistSchema);
