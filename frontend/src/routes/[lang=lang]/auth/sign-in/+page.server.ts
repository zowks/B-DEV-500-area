import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import validateCredentials from "$lib/utils/auth/validateCredentials";

export const actions: Actions = {
    default: async ({ request, locals: { LL } }) => {
        const data = await request.formData();
        const errors = validateCredentials(data, LL);

        if (errors)
            return fail(400, errors);
        redirect(303, "..");
    }
};
