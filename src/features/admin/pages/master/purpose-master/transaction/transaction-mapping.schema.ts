import { z } from 'zod'

export const TransactionMappingSchema = z.object({
   transaction_name: z.string({
      required_error: 'Transaction type is required',
   }).min(1, { message: 'Transaction type is required' })
})
  

