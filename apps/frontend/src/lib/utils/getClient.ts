import { env } from "$env/dynamic/private";
import type { Client } from "~/app";
import api from "@common/api/api";

export default async function getClient(accessToken?: string): Promise<Client | null> {
    if (!accessToken)
        return null;

    const response = await api.users.me(env.SERVER_API_URL, accessToken);

    if (response.success)
        return { ...response.body, accessToken };
    return null;
}
