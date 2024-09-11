import { z } from "zod";

// Define the Zod schema
export const playlistValidationSchema = z.object({
  playListName: z.string().nonempty({ message: "Play list name is required" }),
});

export const playlistValidation = {
  playlistValidationSchema,
};
