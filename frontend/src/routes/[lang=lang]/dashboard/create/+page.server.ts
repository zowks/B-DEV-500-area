import { env } from "$env/dynamic/private";
import type { Actions, PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import api from "@common/api/api";

export const actions: Actions = {
    oauth: async ({ request, url, locals: { client }, cookies }) => {
        if (!client)
            return error(401, "Unauthorized");

        const data = await request.formData();
        const scope = data.get("scope");

        const response = await api.oauth.google(
            env.API_URL,
            {
                redirect_uri: url.origin + url.pathname,
                scope: scope as string || ""
            },
            client.accessToken
        );

        if (!response.success)
            return error(401, "Unauthorized");
        const [cookieName, cookieValue] = response.body.connectCookie.split(";")[0].split("=");

        console.log("set cookie", cookieName, cookieValue);
        cookies.set(cookieName, cookieValue, {
            path: "/", // Path where the cookie is accessible
            httpOnly: true, // Cookie is accessible only by the server
            secure: false,
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "none"
        });
        return redirect(303, response.body.redirect_uri);
    }
};

export const load: PageServerLoad = async ({ parent }) => {
    const { locale, services, client } = await parent();

    return { locale, services, client, apiUrl: env.API_URL };
};
