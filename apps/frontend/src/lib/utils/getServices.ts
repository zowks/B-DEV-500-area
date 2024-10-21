import { env } from "$env/dynamic/private";
import api from "@common/api/api";
import type { Services } from "~/app";

export default async function getServices(): Promise<Services | null> {
    const response = await api.about(env.SERVER_API_URL);

    if (response.success)
        return response.body.server.services;
    return null;
}
