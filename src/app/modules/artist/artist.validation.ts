import { z } from "zod";

const expertiseSchema = z.object({
  value: z.string().nonempty({ message: "expertise value is required" }),
  label: z.string().nonempty({ message: "expertise label is required" }),
});

const proficiencySchema = z.object({
  value: z.string().nonempty({ message: "proficiency value is required" }),
  label: z.string().nonempty({ message: "proficiency label is required" }),
});

const musicSchema = z.object({});

// Define the Zod schema
export const artistValidationSchema = z.object({
  firstName: z.string().nonempty({ message: "first name is required" }),
  lastName: z.string().nonempty({ message: "last name is required" }),
  email: z.string().nonempty({ message: "email is required" }),
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password cannot be more than 20 characters long" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long",
    }),
  expertise: z
    .array(expertiseSchema)
    .nonempty({ message: "Expertise is required" }),
  proficiency: z
    .array(proficiencySchema)
    .nonempty({ message: "Proficiency is required" }),
  music: z.array(musicSchema).nonempty({ message: "Sample work is required" }),
  portfolio: z.string().nonempty({ message: "portfolio is required" }),
  status: z.enum(["blocked", "active"]).default("active"),
});

export const artistValidation = {
  artistValidationSchema,
};
