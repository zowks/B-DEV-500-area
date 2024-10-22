import { Empty, RequestResponse } from "../api";

type OAuthCallbackPayload = {
    code: string;
    state: string;
};

export default async function callback(apiUrl: string, service: string, payload: OAuthCallbackPayload, accessToken: string): Promise<RequestResponse<Empty, 303 | 403>> {
    try {
        const response = await fetch(`${apiUrl}/oauth/${service}/callback?code=${payload.code}&state=${payload.state}`, {
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
