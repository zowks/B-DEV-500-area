import { RequestResponse } from "../api";
import { Area } from "../../types/area/interfaces/area.interface";

export default async function getWebhook(apiUrl: string, accessToken: string, webhookId: string): Promise<RequestResponse<Area, 200 | 404>> {
    try {
        const response = await fetch(`${apiUrl}/webhooks/${webhookId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        switch (response.status) {
        case 200:
            return { status: 200, success: true, body: await response.json() };
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
