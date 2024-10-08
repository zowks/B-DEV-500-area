import CryptoJS from "crypto-js";

export default function hashString(string: string, algorithm: string = "SHA-512"): string {
    let hash;
    switch (algorithm) {
    case "SHA-256":
        hash = CryptoJS.SHA256(string);
        break;
    case "SHA-512":
        hash = CryptoJS.SHA512(string);
        break;
    default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    return hash.toString(CryptoJS.enc.Hex);
}