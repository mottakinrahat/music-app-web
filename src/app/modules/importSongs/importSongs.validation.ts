import { z } from "zod";

// Define the Zod schema
export const importSongValidationSchema = z.object({
  songName: z.string().nonempty({ message: "song name is required" }),
  songLink: z.string().nonempty({ message: "song link is required" }),
});

export const importSongValidation = {
  importSongValidationSchema,
};
