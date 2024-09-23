import { z } from 'zod';

// TODO: Use parent Response type / abstract this
const LoginResponse = z.union([
    z.object({
        code: z.literal(400),
        message: z.literal('Invalid credentials'),
        errors: z.unknown() // TODO: find a way to include ZodFormattedError
    }),
    z.object({
        code: z.literal(200),
        message: z.literal('Success'),
        data: z.object({
            token: z.string()
        })
    })
]);

export type LoginResponse = z.infer<typeof LoginResponse>;

export function parseLoginResponse(data: unknown) {
    return LoginResponse.safeParse(data);
}
