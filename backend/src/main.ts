import { NestFactory } from "@nestjs/core";
import {
    DocumentBuilder,
    OpenAPIObject,
    SwaggerCustomOptions,
    SwaggerModule
} from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import * as session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

function getSwaggerDocumentConfig(): Omit<OpenAPIObject, "paths"> {
    return new DocumentBuilder()
        .setTitle("AREA API Documentation")
        .setDescription(
            "This document showcases all the API endpoints that you can use to communicate with the backend server. It provides example and an exhaustive set of param definitions."
        )
        .setVersion("1.0")
        .addTag(
            "authentication",
            "Describes all the routes for authentication purposes."
        )
        .addTag(
            "youtube",
            "Describes all the routes for the YouTube OAuth2.0 interactions."
        )
        .build();
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    app.use(helmet());

    const configService = app.get(ConfigService);
    const redisPassword = configService.getOrThrow("REDIS_PASSWORD");
    const redisStore = new RedisStore({
        client: createClient({
            url: `redis://${redisPassword}@localhost:6379`,
            pingInterval: 60000
        })
    });

    app.use(
        session({
            secret: configService.getOrThrow("EXPRESS_SESSION_SECRET"),
            resave: false,
            saveUninitialized: false,
            store: redisStore
        })
    );

    const swaggerDocumentConfig = getSwaggerDocumentConfig();

    const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);

    const swaggerTheme = new SwaggerTheme();
    const swaggerConfig: SwaggerCustomOptions = {
        customCss: swaggerTheme.getBuffer(SwaggerThemeNameEnum.DARK),
        customSiteTitle: swaggerDocumentConfig.info.title
    };
    SwaggerModule.setup("/", app, document, swaggerConfig);

    await app.listen(configService.get<number>("REST_API_PORT", 3000));
}
bootstrap();
