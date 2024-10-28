import { ZodType, z } from "zod";

export class GenreValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(3),
        description: z.string().min(3),
    })

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(3).optional(),
        description: z.string().min(3).optional(),
    })

    static readonly CONECTED: ZodType = z.object({
        genreId: z.string().min(3),
        bookId: z.string().min(3),
    })

    static readonly DISCONECTED: ZodType = z.object({
        genreId: z.string().min(3),
        bookId: z.string().min(3),
    })


    static readonly DELETE: ZodType = z.object({
        id: z.string().min(3),
    })
}