/**
 * @type LoginResponse
 *
 * @property {200 | 400} code - The HTTP status code of the response.
 * @property {"Success" | "Invalid credentials"} message - The message of the response.
 * @property {string} [data.token] - The JWT token (if code is 200).
 * @property {string[]} [errors] - The credentials parsing error (if code is 400).
 */
export type LoginResponse =
    | {
          code: 200;
          message: "Success";
          data: {
              token: string;
          };
      }
    | {
          code: 400;
          message: "Invalid credentials";
          errors: string[];
      };
