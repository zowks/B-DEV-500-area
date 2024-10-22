import type { RequestResponse } from "../api";
import type { Area } from "../../types/area/interfaces/area.interface";

export default async function getById(apiUrl: string, accessToken: string, areaId: string): Promise<RequestResponse<Area, 200 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/area/${areaId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        switch (response.status) {
        case 200:
            return { status: 200, success: true, body: await response.json() };
        case 401:
            return { status: 401, success: false }; // Either the JWT is expired or invalid or the user has been deleted.
        default:
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
