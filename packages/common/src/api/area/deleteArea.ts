import { RequestResponse, Empty } from "../api";

export default async function deleteArea(apiUrl: string, accessToken: string, areaId: string): Promise<RequestResponse<Empty, 204 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/area/${areaId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        switch (response.status) {
        case 204:
            return { status: 204, success: true, body: { } };
        case 401:
            return { status: 401, success: false };
        default:
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
