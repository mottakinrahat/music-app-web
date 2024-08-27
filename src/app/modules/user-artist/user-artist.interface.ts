import { ObjectId } from "mongoose";

export interface TUserArtist {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  userId: ObjectId;
  userRef: "User" | "Artist";
}
