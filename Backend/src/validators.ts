import { z } from 'zod'


export const userSchema = z.object({
    fullname: z.string(),
    phone: z.string(),
    address: z.string(),
    score: z.number()
})


