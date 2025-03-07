import { z } from "zod";

// Define the schema for the update incident form
export const updateIncidentFormSchema = z.object({
  passportNumber: z.string().min(6, "Passport number must be at least 6 characters"),
  departureDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format (DD/MM/YYYY)"),
  buySell: z.enum(["Buy", "Sell"], { message: "Buy or sell is required" }),
  cardNumber: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "Invalid card number format"),
  incidentNumber: z.string().min(5, "Incident number must be at least 5 characters"),
  transactionType: z.string().min(3, "Transaction type is required"),
  eonInvoiceNumber: z.string().min(5, "EON Invoice Number is required"),
  comment: z.string().optional(),
  status: z.enum(["approve", "reject"], { message: "Status is required" }),
  tableData: z
    .array(
      z.object({
        currency: z.string(),
        rate: z.number().positive("Rate must be a positive number"),
        amount: z.number().positive("Amount must be a positive number"),
      })
    )
    .min(1, "At least one exchange rate entry is required"),
});

export type UpdateIncidentFormType = z.infer<typeof updateIncidentFormSchema>;
