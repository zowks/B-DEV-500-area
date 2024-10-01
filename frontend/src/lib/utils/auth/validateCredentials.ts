import type { TranslationFunctions } from "$i18n/i18n-types";
import isEmail from "$lib/utils/auth/isEmail";

export default function validateCredentials(data: FormData, LL: TranslationFunctions) {
    const email = data.get("email");
    const password = data.get("password");

    if (!email)
        return { email, emailError: LL.auth.errors.missingEmail() };
    if (typeof email !== "string" || !isEmail(email))
        return { email, emailError: LL.auth.errors.incorrectEmail() };
    if (!password)
        return { email, passwordError: LL.auth.errors.missingPassword() };
    if (typeof password !== "string" || password.length < 8)
        return { email, passwordError: LL.auth.errors.incorrectPassword() };
    return null;
}
