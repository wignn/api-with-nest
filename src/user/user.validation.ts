
import { z, ZodType, } from 'zod';

export class UserValidation {
    static readonly REGISTER :  ZodType = z.object({
        name: z.string().min(3).max(100).optional(),
        username: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string().min(6).max(100),
    });
    static userResponse = z.object({
        id: z.string(),
        name: z.string().optional(),
        username: z.string(),
    });


    static readonly LOGIN :  ZodType = z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(6).max(100),
    })


    static readonly RESET : ZodType = z.object({
        email: z.string().min(3).max(100),
        password: z.string().min(6).max(100),
        valToken: z.string().min(6)
    })
}