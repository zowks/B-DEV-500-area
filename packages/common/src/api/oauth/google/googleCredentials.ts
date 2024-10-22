import { RequestResponse } from "../../api";

type OAuthGoogleCredentialsResponse = {
    id: number
    access_token: string
    refresh_token: string
    expires_at: Date
    scope: string
}

export default async function googleCredentials(apiUrl: string, accessToken: string): Promise<RequestResponse<OAuthGoogleCredentialsResponse, 200 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/google/credentials`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: "include"
        });

        switch (response.status) {
        case 200:
            return { status: 200, success: true, body: await response.json() };
        case 401:
            return { status: 401, success: false }; // This route is protected. The client must supply a Bearer token.
        default:
            return { status: 500, success: false };
        }
    } catch {
        return { status: 500, success: false };
    }
}
