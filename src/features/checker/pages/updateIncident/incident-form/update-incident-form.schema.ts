import * as z from "zod";

export const updateIncidentFormSchema = z.object({
  fields: z.object({
    // Include all fields from the type definition
    niumId: z.string().optional(),
    cardNo: z.string().optional(),
    customerPan: z.string().optional(),
    customerName: z.string().optional(),
    bmfOrderRef: z.string().optional(),
    transactionType: z.string().optional(),
    purpose: z.string().optional(),
    buySell: z.string().optional(),
    incidentNumber: z.string().optional(),
    eonInvoiceNumber: z.string().optional(),
    comment: z.string().optional()
      .refine(value => {
        // If fields.status.reject is true, then comment is required
        return true; // We'll do the validation separately based on UI state
      }, {
        message: "Comment is required when rejecting an incident",
      }),
    status: z.object({
      approve: z.boolean().optional(),
      reject: z.boolean().optional(),
    }),
    niumInvoiceNo: z.string().optional()
      .refine(value => {
        // If fields.status.approve is true, then niumInvoiceNo is required
        return true; // We'll do the validation separately based on UI state
      }, {
        message: "Nium Invoice Number is required when approving an incident",
      }),
    
    // Also include the original field names for backward compatibility
    passportNumber: z.string().optional(),
    cardNumber: z.string().optional(),
    departureDate: z.string().optional(),
  }).refine(
    (data) => {
      // If approve is selected, niumInvoiceNo is required
      if (data.status.approve && !data.status.reject) {
        return !!data.niumInvoiceNo;
      }
      // If reject is selected, comment is required
      if (data.status.reject && !data.status.approve) {
        return !!data.comment;
      }
      return true;
    },
    {
      message: "Required fields are missing",
      path: ["status"],
    }
  ),
});

export type UpdateIncidentFormType = z.infer<typeof updateIncidentFormSchema>;
