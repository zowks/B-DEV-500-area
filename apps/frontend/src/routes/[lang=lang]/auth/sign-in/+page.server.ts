import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";
import api from "@common/api/api";
import type { Actions } from "./$types";
import getClient from "$lib/utils/getClient";
import validateCredentials from "$lib/utils/auth/validateCredentials";
import type { TranslationFunctions } from "$i18n/i18n-types";
import type { ApiError } from "$i18n/types";

const ERROR_KEYS: Record<number, ApiError> = {
    400: "incorrectFields",
    403: "invalidCredentials"
};

function signInFail(status: number, LL: TranslationFunctions) {
    return fail(
        status,
        { errorMessage: LL.error.api[ERROR_KEYS[status] || "unknown"]() }
    );
}

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const data = await request.formData();
        const email = data.get("email");
        const password = data.get("password");
        const payload = validateCredentials({ email, password }, locals.LL);

        if (payload.error)
            return fail(400, payload);

        const response = await api.auth.signIn(env.API_URL, payload);

        if (!response.success)
            return signInFail(response.status, locals.LL);

        const client = await getClient(response.body.access_token);

        if (!client)
            return signInFail(500, locals.LL);
        locals.client = client;
        cookies.set("accessToken", response.body.access_token, { path: "/", secure: false });
        return redirect(303, "/");
    }
};
