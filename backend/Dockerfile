FROM alpine:3.20.3 AS base

LABEL org.opencontainers.image.source https://github.com/zowks/B-DEV-500-area

RUN apk update                 \
    && apk upgrade             \
    && apk add npm=10.8.0-r0   \
    && rm -rf /var/cache/apk/*

FROM base AS setup

WORKDIR /usr/app/

COPY src/ src/

COPY prisma/ prisma/

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY tsconfig.build.json tsconfig.build.json

COPY tsconfig.json tsconfig.json

RUN npm install --save

FROM setup AS build

RUN npm run prisma:generate

RUN npm run build

FROM build AS serve

ENTRYPOINT [ "npm", "start" ]
