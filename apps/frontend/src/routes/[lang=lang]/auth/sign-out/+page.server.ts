import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";
import api from "@common/api/api";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ locals: { locale, client } }) => {
        if (!client)
            return error(401, "Unauthorized");

        const response = await api.auth.signOut(env.SERVER_API_URL, client.accessToken);

        if (response.status !== 204 && response.status !== 401)
            return error(response.status);

        return redirect(303, `/${locale}/auth/sign-in`);
    }
};
