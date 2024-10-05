/**
 * Check if email is a valid email address.
 *
 * The RegEx is from email-validator package (https://github.com/manishsaraan/email-validator/blob/master/index.js).
 *
 * @param {string} email The email address to check.
 *
 * @returns {boolean} true if the email is a valid email address, false otherwise.
 */
export default function isEmail(email: string): boolean {
    return /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email);
}
