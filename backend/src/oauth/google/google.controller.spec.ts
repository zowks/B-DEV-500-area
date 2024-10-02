import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOAuthController } from './google.controller';

describe('OauthController', () => {
  let controller: GoogleOAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleOAuthController],
    }).compile();

    controller = module.get<GoogleOAuthController>(GoogleOAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
