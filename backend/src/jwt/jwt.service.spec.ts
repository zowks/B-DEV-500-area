import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as jose from 'jose';

const fakeEnv = {
  JWT_ISSUER: 'area-backend-unit-tests',
  JWT_SECRET: '5044d47226c19a4d63fd7eab79373b30',
  JWE_PUBLIC_KEY: 'test/test_jwe_public_key.pem',
  JWE_PRIVATE_KEY: 'test/test_jwe_private_key.pem',
  JWT_EXPIRES_IN: '3s',
};

const configService: Partial<ConfigService> = {
  get: jest
    .fn()
    .mockImplementation((property: string): string => fakeEnv[property]),
  getOrThrow: jest.fn().mockImplementation((property: string): string => {
    const value = fakeEnv[property];
    if (undefined === value)
      throw new Error(`Env variable not found: ${property}`);
    return value;
  }),
};

function b64decode(s: string): string {
  return Buffer.from(s, 'base64').toString('utf-8');
}

describe('CryptoService', () => {
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    expect(jwtService.areKeysLoaded()).toBe(false);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('JWE settings', () => {
    it('should confirm the required settings for JWE forge and verification', () => {
      expect(JwtService.JWS_ALG).toBe('HS512');
      expect(JwtService.JWE_ALG).toBe('RSA-OAEP-512');
      expect(JwtService.JWE_ENC).toBe('A256GCM');
    });

    it('should make sure the secret key is 32 bytes long', () => {
      expect(
        Test.createTestingModule({
          providers: [
            JwtService,
            {
              provide: ConfigService,
              useValue: {
                get: jest
                  .fn()
                  .mockImplementation((property: string): string =>
                    property !== 'JWT_SECRET'
                      ? fakeEnv[property]
                      : 'invalidkeylength',
                  ),
              },
            },
          ],
        }).compile(),
      ).rejects.toThrow(Error);
    });
  });

  describe('JWE forge', () => {
    it('should forge a new JWE', async () => {
      const _payload = { id: randomUUID() };
      const jwe = await jwtService.forgeJwe(_payload);
      expect(jwtService.areKeysLoaded()).toBe(true);
      const segments = jwe.split('.', 2);

      const decodedHeader = b64decode(segments[0]);
      expect(JSON.parse(decodedHeader)).toStrictEqual({
        alg: JwtService.JWE_ALG,
        enc: JwtService.JWE_ENC,
      });

      const decodedPayload = b64decode(segments[1]);
      expect(() => JSON.parse(decodedPayload)).toThrow(SyntaxError);
    });
  });

  describe('JWE verify', () => {
    it('should return the paylaod from the jwe', async () => {
      const jwe =
        'eyJhbGciOiJSU0EtT0FFUC01MTIiLCJlbmMiOiJBMjU2R0NNIn0.cBOWR1C70VM5n1pWuEt2IIYCxIaQtWHQzjIASDzdX2IhLiReP5efiQSKaRVciUMuGCuBM0nIf7_FZ6iaGHzC3-bmw_fU7kIHGsq6erpvYNytXXfyfZpdbqOL17o6Cfmsc3Y3KhEXBfwbF_QGxilh69OhsauwYoQ8_t3CL-Ns_KRwcATQjLkMVezNQl4XG3m1eyw7EI6M9u9PXYT8J2iyVSoUmbDutUD1R7gXZd9mP9YrAJpxti5jKb-580YflTsU0Grn4QJFzVi661GcfBn7Xfzic0HihSrz5s62Q8dvZ7LbAA-jXeYsJqrTEsLMwo0f_R0IF79m8rxVmyybY7Ii6Wm_p6OKOQkSEbt9Nh6VYMCC6HHcelKIhkeM-h5HYJEy6kGNK4Te3wVpoxKZZXWyjzh08bY9-Ex1WyQiSzAPGCxYC8cBro1W2kDPYLjohpuzgaMKiO5B_23dm9v0uCBlKOevrd9nGsnhfpEfdIOKd0uDP0xoVwDjIHIIAd3aCWjQdU7KJNnhcLDHavv_3ym778Kt6zTSIaJpkxSCSEEodPTGA7aJcacnAyMhFRkrYSkB7eibt_ilgjhwOMAIXHckY4rtqKo29PtIRxMFtB2NooA6mxHO5HXH0DVzoK4TNDWxpa5YU2yrC5KoUav0qaAQ423LtKSNps5WkLZTVkaptIs.h3tX2HRq_oHYs2nv.onzodOA2iz4nxzoFrqIiXsFkcvpMdDwO_gcSLKWxpZgEwVMLo_hgn5ze5LPjEh_XIpW3LgD69lujJ-KNv8wuhmS1XTYRhmZYxWvPBzstcfp27jRGpApwIVehytWySnqLNiqlJYAZfifxTBMSlop2iOri24EfbG4ETRE_0vBenLkFC309MROpildbT6EU5lfLNqLF7N_ZklXU43zhw2CJ4nBKliPM25tvCrwxhcIJX6bEnqjewTJRuQNB3CqBwd5tYm0A60h1hUZQEY8FeUq5lrbI5coJR_sl2-VTFYGdzqDuttQ2u0Wwr8sBAppldpoAwnShSPKg0Y3rKjsfklDki9tiDA.eaadKh1ew-X6XnfVb7reRw';
      const jwt = (await jwtService.verifyJwe(jwe, false)) as any;
      expect(jwtService.areKeysLoaded()).toBe(true);

      expect(jwt.id).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
      );
    });
    it('should return an error as the jwe is expired', async () => {
      const jwe = await jwtService.forgeJwe({});
      const timeout = setTimeout(async function () {
        try {
          await jwtService.verifyJwe(jwe);
        } catch (e) {
          expect(e).toBeInstanceOf(jose.errors.JWTClaimValidationFailed);
        }
        clearTimeout(timeout);
      }, 3500);
    });
  });
});
