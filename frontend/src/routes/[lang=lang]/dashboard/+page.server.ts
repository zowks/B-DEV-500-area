import type { Actions, PageServerLoad } from "./$types";
import api from "@common/api/api";
import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";

export const actions: Actions = {
    oauth: async ({ request, url, locals: { client } }) => {
        if (!client)
            return error(401, "Unauthorized");

        const data = await request.formData();
        const scope = data.get("scope");

        const response = await api.oauth.google(
            env.API_URL,
            {
                redirect_uri: url.origin + url.pathname,
                scope: scope || ""
            },
            client.accessToken
        );

        if (!response.success)
            return error(401, "Unauthorized");
        return redirect(303, response.body.redirect_uri);
    }
};

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
