import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { locale, services, client } = await parent();

    return { locale, services, client, apiUrl: env.CLIENT_API_URL };
};
