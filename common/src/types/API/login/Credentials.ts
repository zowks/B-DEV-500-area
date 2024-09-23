import { z, type SafeParseReturnType } from 'zod';

/**
 * Credentials schema.
 *
 * @property {string} email - Must respect the email format (verified by regex).
 * @property {string} password - Minimum length: 1.
 */
const Credentials = z.object({
    email: z.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: z.string().min(1)
});

/**
 * Credentials schema as a TypeScript type.
 */
export type Credentials = z.infer<typeof Credentials>;

/**
 * Parse (validate) credentials.
 * Zod checks if data matches the Credentials schema:
 * - email property is present, is a string, and matches the email regex.
 * - password property is present and is a string with minimum length of 1.
 *
 * @param {unknown} data The data to parse.
 *
 * @returns If data respects the Credentials schema,
 * SafeParseSuccess<Credentials> with data in data property.
 * Otherwise, SafeParseError<Credentials> with error details in error property.
 */
export function parseCredentials(data: unknown): SafeParseReturnType<Credentials, Credentials> {
    return Credentials.safeParse(data);
}
