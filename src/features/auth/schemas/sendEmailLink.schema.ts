
import * as z from "zod"

export const emailLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address")
})

export type EmailLinkSchema = z.infer<typeof emailLinkSchema>