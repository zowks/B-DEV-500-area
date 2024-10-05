import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import validateCredentials from "$lib/utils/auth/validateCredentials";

export const actions: Actions = {
    default: async ({ request, locals: { LL } }) => {
        const data = await request.formData();
        const email = data.get("email");
        const password = data.get("password");
        const credentials = validateCredentials({ email, password }, LL);

        if (credentials.error)
            return fail(400, credentials);
        redirect(303, "..");
    }
};
