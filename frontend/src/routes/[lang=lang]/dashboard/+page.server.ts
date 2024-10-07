import type { PageServerLoad } from "./$types";
import api from "@common/api/api";
import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ parent }) => {
    const { locale, services, client } = await parent();

    if (!client)
        return error(401, "Unauthorized");

    const areas = await api.area.getAll(env.API_URL, client.accessToken);
    if (areas.status === 401)
        return redirect(302, `/${locale}/auth/sign-in`);
    if (!areas.success)
        return error(500, "Internal Server Error");

    return { locale, services, areas: areas.body };
};
