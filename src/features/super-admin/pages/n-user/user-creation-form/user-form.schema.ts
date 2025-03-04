import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
 
  productType: z
    .object({
      card: z.boolean(),
      remittance: z.boolean(),
      both: z.boolean(),
    }) 
    .refine((data) => Object.values(data).some(Boolean), {
      message: "Please select at least one product type",
      path: ["productType"],
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
