import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-strategy";
import { JwtService } from "../../jwt/jwt.service";
import { User } from "../../users/interfaces/user.interface";
import * as jose from "jose";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly jwtService: JwtService
    ) {
        super();
    }

    private static extractBearerToken(req: Request): string | null {
        const authorization = req.headers["authorization"];
        if (undefined === authorization) return null;

        const [bearer, token] = authorization.split(/\s/, 2);
        if ("bearer" !== bearer.toLowerCase() || undefined === token)
            return null;

        return token;
    }

    async authenticate(req: Request) {
        const jwe = JwtStrategy.extractBearerToken(req);
        if (null === jwe) return this.fail(HttpStatus.UNAUTHORIZED);

        try {
            const payload = (await this.jwtService.verifyJwe(jwe)) as Pick<
                User,
                "id"
            >;

            if ((await this.cacheManager.get(jwe)) === payload["id"])
                return this.fail(HttpStatus.UNAUTHORIZED);

            return this.success(payload);
        } catch (e) {
            if (
                e instanceof jose.errors.JWTClaimValidationFailed &&
                "iat" === e.claim &&
                "check_failed" === e.reason
            )
                return this.fail(HttpStatus.UNAUTHORIZED);
            console.error(e);
            return this.fail(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
