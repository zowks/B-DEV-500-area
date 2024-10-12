import hashString from "./hashString";

export default async function hashPassword(password: FormDataEntryValue | null) {
    return await hashString(password?.toString() || "");
}
