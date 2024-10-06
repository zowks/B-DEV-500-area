export default async function hashString(string: string, algorithm: string = "SHA-512") {
    const hashBuffer = await crypto.subtle.digest(algorithm, (new TextEncoder()).encode(string));
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
}
