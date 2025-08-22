import { z } from 'zod';

const postContentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(3, 'Post Content must be at least 3 characters long')
        .max(280, 'Post Content should be less than 280 characters long')
});

export { postContentSchema };
