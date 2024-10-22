import { ZodType, z } from "zod";


export class MailerValidation {
    static readonly SEND : ZodType = z.object({
        email: z.string().email(),
        valToken: z.string().min(6)
    })
}