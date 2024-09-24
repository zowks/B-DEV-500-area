/**
 * @type Credentials
 *
 * @property {string} email - Must respect the email format (verified by regex).
 * @property {string} password - Minimum length: 1.
 */
export type Credentials = {
    email: string;
    password: string;
};
