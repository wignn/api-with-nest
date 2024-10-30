import { z, ZodType } from 'zod';

export class CreateBookmarkRequest {
  static readonly CREATE: ZodType = z.object({
    bookId: z.string().min(3),
    userId: z.string().min(3),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().min(3),
  });

  
}
