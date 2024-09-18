import { ObjectId } from "mongoose";

interface Expertise {
  value: string;
  label: string;
}

interface Proficiency {
  value: string;
  label: string;
}

interface Music {
  musicLink: string;
}

export interface TArtist {
  firstName: string;
  lastName: string;
  email: string;
  expertise: Expertise[];
  proficiency: Proficiency[];
  music: Music[];
  password: string;
  portfolio: string;
  artistImage: string;
  albums: ObjectId;
  status: "blocked" | "active";
  role: string;
}

export type TLoginArtist = {
  email: string;
  password: string;
};
