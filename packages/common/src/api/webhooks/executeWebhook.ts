import { RequestResponse, Empty } from "../api";

export default async function executeWebhook(apiUrl: string, accessToken: string, webhookId: string): Promise<RequestResponse<Empty, 200 | 404>> {
    try {
        const response = await fetch(`${apiUrl}/webhooks/${webhookId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        switch (response.status) {
        case 200:
            return { status: 200, success: true, body: { } };
        case 404:
            return { status: 404, success: false };
        default:
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}