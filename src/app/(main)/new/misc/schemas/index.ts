import { z, ZodError } from "zod";

export const CreateNewPostFormSchema = z.object({
    title: z.string({ message: 'Title is required' }).min(5, { message: 'Title must be at least 5 characters' }),
    content: z.string({ message: 'You cannot post an empty article' }).min(50, { message: 'Article must be at least 50 characters' }),
    tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
    cover_image: z.any().nullable().refine(
        file => {
            if (!file) {
                throw ZodError.create([{
                    path: ['cover_image'],
                    message: 'Please select a cover image.',
                    code: 'custom',
                }]);
            }
            if (!file.type.startsWith('image/')) {
                throw ZodError.create([{
                    path: ['cover_image'],
                    message: 'Please select a valid image file.',
                    code: 'custom',
                }]);
            }
            return file.size <= 10000000;
        },

        {
            message: 'Max image size is 10MB.',
        }
    ),
});