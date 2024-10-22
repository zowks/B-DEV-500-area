import type { RequestResponse } from "../api";
import type { UpdateAreaDto } from "../../types/area/dto/updateArea.dto";
import type { Area } from "../../types/area/interfaces/area.interface";

export default async function patchById(apiUrl: string, accessToken: string, areaId: string, body: UpdateAreaDto): Promise<RequestResponse<Area, 200 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/area/${areaId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
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
