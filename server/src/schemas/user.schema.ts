import { TypeOf, string, z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3)
      .max(20),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password too short - should be 8 chars minimum"),
    confirmPassword: z.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpBody = TypeOf<typeof signUpSchema>;
