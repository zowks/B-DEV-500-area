import { z } from 'zod';

const Credentials = z.object({
    email: z.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: z.string().min(1)
});

export type Credentials = z.infer<typeof Credentials>;

export function parseCredentials(data: unknown) {
    return Credentials.safeParse(data);
}
