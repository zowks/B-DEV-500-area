import { hash, argon2id, verify } from "argon2";
import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";

/* https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id */
const OWASP_CONFIGS = [
    { m: 47104, t: 1, p: 1 } /* DO NOT USE WITH ARGON2I */,
    { m: 19456, t: 2, p: 1 } /* DO NOT USE WITH ARGON2I */,
    { m: 12288, t: 3, p: 1 },
    { m: 9216, t: 4, p: 1 },
    { m: 7168, t: 5, p: 1 }
];

@Injectable()
export class Argon2Service {
    static CONFIG = OWASP_CONFIGS[2];

    hashPassword(password: string) {
        return hash(password, {
            type: argon2id,
            memoryCost: Argon2Service.CONFIG.m,
            timeCost: Argon2Service.CONFIG.t,
            parallelism: Argon2Service.CONFIG.p,
            hashLength: 32,
            salt: randomBytes(16)
        });
    }

    verifyPassword(hash: string, password: string) {
        return verify(hash, password);
    }
}
