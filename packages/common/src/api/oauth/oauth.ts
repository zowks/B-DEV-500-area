import type { RequestResponse } from "../api";

type OAuthPayload = {
    redirect_uri: string;
    scope: string;
};

// TODO: common response type
export default async function oauth(apiUrl: string, service: string, payload: OAuthPayload, accessToken: string): Promise<RequestResponse<{ redirect_uri: string; }, 200 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/${service}?redirect_uri=${payload.redirect_uri}&scope=${payload.scope}`, {
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
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
