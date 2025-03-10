import { z } from "zod";

export const updateIncidentFormSchema = z.object({
  passportNumber: z
    .string()
    .nonempty("Passport Number is required") // Required validation
    .length(8, "Must be 8 alphanumeric characters")
    .regex(/^[A-Za-z0-9]{8}$/, "No spaces/special characters"),

  departureDate: z
    .string()
    .nonempty("Departure Date is required")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format: DD/MM/YYYY"),

  buySell: z.enum(["Buy", "Sell"], { message: "Buy/Sell is required" }),

  cardNumber: z
    .string()
    .nonempty("Card Number is required")
    .regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "Format: ####-####-####-####"),

  incidentNumber: z
    .string()
    .nonempty("Incident Number is required")
    .min(5, "Must be at least 5 characters")
    .regex(/^\S.*\S$/, "No spaces at start/end"),

  transactionType: z
    .string()
    .nonempty("Transaction Type is required")
    .min(3, "Must be at least 3 characters")
    .regex(/^\S.*\S$/, "No spaces at start/end"),

  eonInvoiceNumber: z
    .string()
    .nonempty("EON Invoice Number is required")
    .min(5, "Must be at least 5 characters")
    .regex(/^\S.*\S$/, "No spaces at start/end"),

  comment: z
    .string()
    .nonempty("Comment is required")
    .trim()
    .regex(/^\S.*\S$/, "No spaces at start/end"),

  status: z
    .object({
      approve: z.boolean(),
      reject: z.boolean(),
    })
    .refine((data) => Object.values(data).some(Boolean), {
      message: "Status is required",
    }),
});






export type updateIncidentFormSchema = z.infer<typeof updateIncidentFormSchema>;


