import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseCredentials } from '@common/types/API/login/Credentials';
import { type LoginResponse } from '@common/types/API/login/LoginResponse';

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}

    getHello(): string {
        return 'Hello World!';
    }

    // TODO: find why object fields in LoginResponse are not required
    login(@Req() request: Request): LoginResponse {
        const credentials = parseCredentials(request.body);

        if (!credentials.success) {
            return {
                code: 400,
                message: 'Invalid credentials',
                error: credentials.error.format(),
            };
        }
        return {
            code: 200,
            message: 'Success',
            data: {
                token: this.configService.get('JWT_SECRET'),
            },
        };
    }
}
