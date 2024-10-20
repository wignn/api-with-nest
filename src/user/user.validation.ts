
import { z, ZodType, } from 'zod';

export class UserValidation {
    static readonly REGISTER :  ZodType = z.object({
        name: z.string().min(3).max(100).optional(),
        username: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string().min(6).max(100),
    });
    static userResponse = z.object({
        id: z.number(),
        name: z.string().optional(),
        username: z.string(),
        email: z.string().email(),
    });
}