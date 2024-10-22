import type { RequestResponse } from "../api";

/**
 * Signs the user out (calls the /auth/logout API endpoint).
 *
 * @param apiUrl The URL of the API.
 * @param accessToken The user's access token.
 */
export default async function signIn(apiUrl: string, accessToken: string): Promise<RequestResponse<undefined, 204 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        switch (response.status) {
        case 204:
            return { status: 204, success: true, body: undefined }; // The user's token has been cached until it expires. The logout is successful.
        case 401:
            return { status: 401, success: false }; // The user was not logged in.
        default:
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
