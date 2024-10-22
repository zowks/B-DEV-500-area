import { RequestResponse } from "../api";
import { CreateAreaDto } from "../../types/area/dto/createArea.dto";
import { Area } from "../../types/area/interfaces/area.interface";

export default async function createArea(apiUrl: string, accessToken: string, body: CreateAreaDto): Promise<RequestResponse<Area, 201 | 401>> {
    try {
        const response = await fetch(`${apiUrl}/area`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });

        switch (response.status) {
        case 201:
            return { status: 201, success: true, body: await response.json() };
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
