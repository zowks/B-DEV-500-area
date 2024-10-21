import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    KeyLike,
    importSPKI,
    importPKCS8,
    SignJWT,
    CompactEncrypt,
    JWTPayload,
    compactDecrypt,
    jwtVerify
} from "jose";
import { readFileSync } from "node:fs";

@Injectable()
export class JwtService {
    private secret: Uint8Array;
    private issuer: string;
    private expiresIn: string;
    private jwtRSAPublicKeyPath: string;
    private publicKey: KeyLike | null = null;
    private jwtRSAPrivateKeyPath: string;
    private privateKey: KeyLike | null = null;
    public static JWS_ALG: string = "HS512";
    public static JWE_ALG: string = "RSA-OAEP-512";
    public static JWE_ENC: string = "A256GCM";

    constructor(private readonly configService: ConfigService) {
        const secret = this.configService.getOrThrow<string>("JWT_SECRET");
        if (32 !== secret.length)
            throw new Error("The JWS secret key must be 32 bytes long.");
        this.secret = new TextEncoder().encode(secret);

        this.issuer = this.configService.getOrThrow<string>("JWT_ISSUER");

        this.expiresIn =
            this.configService.getOrThrow<string>("JWT_EXPIRES_IN");

        this.jwtRSAPublicKeyPath =
            this.configService.getOrThrow<string>("JWE_PUBLIC_KEY");

        this.jwtRSAPrivateKeyPath =
            this.configService.getOrThrow<string>("JWE_PRIVATE_KEY");
    }

    private async getKeyPair() {
        const publicKey = readFileSync(this.jwtRSAPublicKeyPath, {
            encoding: "utf-8"
        });
        const privateKey = readFileSync(this.jwtRSAPrivateKeyPath, {
            encoding: "utf-8"
        });
        this.privateKey = await importPKCS8(privateKey, JwtService.JWE_ALG);
        this.publicKey = await importSPKI(publicKey, JwtService.JWE_ALG);
    }

    public areKeysLoaded() {
        return null !== this.publicKey && null !== this.privateKey;
    }

    async forgeJwe(payload: JWTPayload): Promise<string> {
        const jws = await new SignJWT(payload)
            .setProtectedHeader({ alg: JwtService.JWS_ALG })
            .setIssuedAt()
            .setIssuer(this.issuer)
            .setExpirationTime(this.expiresIn)
            .sign(this.secret);
        const encodedJws = new TextEncoder().encode(jws);

        if (!this.areKeysLoaded()) await this.getKeyPair();
        const jwe = await new CompactEncrypt(encodedJws)
            .setProtectedHeader({
                alg: JwtService.JWE_ALG,
                enc: JwtService.JWE_ENC
            })
            .encrypt(this.publicKey);

        return jwe;
    }

    async decryptJwe(jwe: string): Promise<string> {
        if (!this.areKeysLoaded()) await this.getKeyPair();
        const { plaintext: encodedJws } = await compactDecrypt(
            jwe,
            this.privateKey,
            {
                keyManagementAlgorithms: [JwtService.JWE_ALG],
                contentEncryptionAlgorithms: [JwtService.JWE_ENC]
            }
        );

        const jws = new TextDecoder().decode(encodedJws);
        return jws;
    }

    async verifyJwe(jwe: string): Promise<object> {
        const jws = await this.decryptJwe(jwe);
        const { payload } = await jwtVerify(jws, this.secret, {
            issuer: this.issuer,
            algorithms: [JwtService.JWS_ALG],
            maxTokenAge: this.expiresIn
        });

        return payload;
    }
}
