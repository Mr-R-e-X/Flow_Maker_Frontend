import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const signUpSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const verifySchema = z.object({
  otp: z.string({ message: "Code is required" }),
});

export const emailTemplateSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  subject: z
    .string({ message: "Subject is required" })
    .min(3, { message: "Subject must be at least 3 characters" }),
  body: z.string({ message: "Content is required" }),
});
export const uploadLeadsSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  CSV_LEAD: z.instanceof(File).superRefine((file, ctx) => {
    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max size is 5MB.",
      });
    }
    if (file.type !== "text/csv") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only .csv files are supported.",
      });
    }
  }),
});
