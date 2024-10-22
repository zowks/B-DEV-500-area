import type { RequestResponse } from "../api";
import { AboutJson } from "../../types/about/interfaces/about.interface";

export default async function about(apiUrl: string): Promise<RequestResponse<AboutJson, 200>> {
    try {
        const response = await fetch(`${apiUrl}/about.json`);

        if (response.ok)
            return { status: 200, success: true, body: await response.json() };
        console.error(response);
        return { status: 500, success: false };
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
