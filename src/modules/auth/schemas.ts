import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .regex( /^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Username must contain only lowercase letters, numbers, and hyphens. It must start and end with a letter or number.')
        .refine((val) => !val.includes('--'), 
            'Username cannot contain consecutive hyphens.'
        )
        .transform((val) => val.toLowerCase()),
})