import type { TranslationFunctions } from "$i18n/i18n-types";
import isEmail from "$lib/utils/auth/isEmail";

type Credentials = {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
};

type ValidatedCredentials = {
    error: false;
    email: string;
    password: string;
} | {
    error: true;
    emailError?: string;
    passwordError?: string;
};

export default function validateCredentials({ email, password }: Credentials, LL: TranslationFunctions): ValidatedCredentials {
    if (!email)
        return { error: true, emailError: LL.auth.errors.missingEmail() };
    if (typeof email !== "string" || !isEmail(email))
        return { error: true, emailError: LL.auth.errors.incorrectEmail() };
    if (!password)
        return { error: true, passwordError: LL.auth.errors.missingPassword() };
    if (typeof password !== "string" || password.length < 8)
        return { error: true, passwordError: LL.auth.errors.incorrectPassword() };
    return { error: false, email, password };
}
