import type { Empty, RequestResponse } from "../api";

type OAuthGooglePayload = {
    redirect_uri: string;
    scope: string;
};

// TODO: common response type
export async function google(apiUrl: string, payload: OAuthGooglePayload, accessToken: string): Promise<RequestResponse<{ redirect_uri: string; }, 200 | 401>> {
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

type OAuthGoogleCallbackPayload = {
    code: string;
    state: string;
};

export async function googleCallback(apiUrl: string, payload: OAuthGoogleCallbackPayload, accessToken: string): Promise<RequestResponse<Empty, 303 | 403>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/google/callback?code=${payload.code}&state=${payload.state}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: "include",
        });

        switch (response.status) {
        case 303:
            return { status: 303, success: true, body: {} };
        case 403:
            return { status: 403, success: false }; // The 'state' attribute stored in the user' session is either invalid or does not match the one sent by Google.
        default:
            return { status: 500, success: false };
        }
    } catch {
        return { status: 500, success: false };
    }
}

type OAuthGoogleCredentialsResponse = {
    id: number
    access_token: string
    refresh_token: string
    expires_at: Date
    scope: string
}

export async function googleCredentials(apiUrl: string, accessToken: string): Promise<RequestResponse<OAuthGoogleCredentialsResponse, 200 | 401>> {
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

export async function googleRevoke(apiUrl: string, payload: { oauthCredentialId: number }, accessToken: string): Promise<RequestResponse<string, 204 | 401 | 404 | 422>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/google/revoke/${payload.oauthCredentialId}`, {
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
