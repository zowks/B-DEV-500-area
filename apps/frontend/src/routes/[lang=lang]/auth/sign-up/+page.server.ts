import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";
import api from "@common/api/api";
import type { Actions } from "./$types";
import validateCredentials from "$lib/utils/auth/validateCredentials";
import type { TranslationFunctions } from "$i18n/i18n-types";
import type { ApiError } from "$i18n/types";
import type { RegisterDto } from "@common/types/auth/dto/register.dto";

type Payload = (RegisterDto & { error: false; }) | {
    error: true;
    emailError?: string;
    passwordError?: string;
    errorMessage?: string;
};

const ERROR_KEYS: Record<number, ApiError> = {
    400: "incorrectFields",
    409: "emailAlreadyTaken",
    422: "termsDenied"
};

function validatePayload(data: FormData, LL: TranslationFunctions): Payload {
    const email = data.get("email");
    const password = data.get("password");
    let firstname = data.get("firstname");
    let lastname = data.get("lastname");
    const credentials = validateCredentials({ email, password }, LL);

    if (credentials.error)
        return credentials;
    if (!firstname || typeof firstname !== "string" || !lastname || typeof lastname !== "string")
        return { error: true, errorMessage: LL.auth.errors.missingField() };
    firstname = firstname.trim();
    lastname = lastname.trim();
    if (!firstname.length || !lastname.length)
        return { error: true, errorMessage: LL.auth.errors.missingField() };

    return {
        ...credentials,
        error: false,
        firstname: firstname,
        lastname: lastname,
        has_accepted_terms_and_conditions: data.get("terms") === "true"
    };
}

export const actions: Actions = {
    default: async ({ request, locals: { LL } }) => {
        const data = await request.formData();
        const payload = validatePayload(data, LL);

        if (payload.error)
            return fail(400, payload);

        const response = await api.auth.signUp(env.SERVER_API_URL, payload);

        if (!response.success)
            return fail(
                response.status,
                { errorMessage: LL.error.api[ERROR_KEYS[response.status] || "unknown"]() }
            );
        return redirect(303, "sign-in");
    }
};
