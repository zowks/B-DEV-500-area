import { RequestResponse } from "../api";

export default async function revoke(apiUrl: string, service: string, payload: { oauthCredentialId: number }, accessToken: string): Promise<RequestResponse<string, 204 | 401 | 404 | 422>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/${service}/revoke/${payload.oauthCredentialId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: "include"
        });

        switch (response.status) {
        case 204:
            return { status: 204, success: true, body: await response.json() };
        case 401:
            return { status: 401, success: false }; // This route is protected. The client must supply a Bearer token.
        case 404:
            return { status: 401, success: false }; // The given credential ID was either not found or does not belong to the current user.
        case 422:
            return { status: 401, success: false }; // The given credential ID was found and belongs to the correct user, but it's OAuth provider is different from the current route provider.
        default:
            return { status: 500, success: false };
        }
    } catch {
        return { status: 500, success: false };
    }
}
