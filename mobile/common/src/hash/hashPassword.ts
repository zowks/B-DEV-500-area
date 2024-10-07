import hashString from "./hashString";

export default async function hasPassword(password: FormDataEntryValue | null) {
    return await hashString(password?.toString() || "");
}
