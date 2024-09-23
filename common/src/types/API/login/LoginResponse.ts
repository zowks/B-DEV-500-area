import { z } from 'zod';

// TODO: Use parent Response type / abstract this
/**
 * LoginResponse schema.
 *
 * @property {200 | 400} code - The HTTP status code of the response.
 * @property {'Success' | 'Invalid credentials'} message - The message of the response.
 * @property {string} [data.token] - The JWT token (if code is 200).
 * @property {unknown} [error] - The credentials parsing error (if code is 400).
 */
const LoginResponse = z.union([
    z.object({
        code: z.literal(200),
        message: z.literal('Success'),
        data: z.object({
            token: z.string()
        })
    }),
    z.object({
        code: z.literal(400),
        message: z.literal('Invalid credentials'),
        error: z.unknown() // TODO: find a way to include ZodFormattedError
    })
]);

/**
 * LoginResponse schema as a TypeScript type.
 */
export type LoginResponse = z.infer<typeof LoginResponse>;

/**
 * Parse (validate) login response.
 * Zod checks if data matches the LoginResponse schema:
 * - if code is 200 and message is 'Success':
 *   - data must be present and have a token property that is a string.
 * - if code is 400 and message is 'Invalid credentials':
 *   - error must be present.
 *
 * @param {unknown} data The data to parse.
 *
 * @returns If data respects the LoginResponse schema,
 * SafeParseSuccess<LoginResponse> with data in data property.
 * Otherwise, SafeParseError<LoginResponse> with error details in error property.
 */
export function parseLoginResponse(data: unknown) {
    return LoginResponse.safeParse(data);
}
