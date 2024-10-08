import type { RequestResponse } from "../api";

type OAuthGooglePayload = {
    redirect_uri: string;
    scope: string;
};

// TODO: common response type
export default async function google(apiUrl: string, payload: OAuthGooglePayload, accessToken: string): Promise<RequestResponse<{ redirect_uri: string; }, 200 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/google?redirect_uri=${payload.redirect_uri}&scope=${payload.scope}`, {
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
