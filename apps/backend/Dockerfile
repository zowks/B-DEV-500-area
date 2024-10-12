FROM alpine:3.20.3 AS base

LABEL org.opencontainers.image.source https://github.com/zowks/B-DEV-500-area

RUN apk update                 \
    && apk upgrade             \
    && apk add npm=10.8.0-r0   \
    && rm -rf /var/cache/apk/*

FROM base AS setup

WORKDIR /usr/app/

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY apps/backend/src/ apps/backend/src/

COPY apps/backend/prisma/ apps/backend/prisma/

COPY apps/backend/package.json apps/backend/package.json

COPY apps/backend/tsconfig.build.json apps/backend/tsconfig.build.json

COPY apps/backend/tsconfig.json apps/backend/tsconfig.json

RUN npm install --save

FROM setup AS build

WORKDIR /usr/app/apps/backend

RUN npm run prisma:generate

RUN npm run build

FROM build AS serve

WORKDIR /usr/app/apps/backend

ENTRYPOINT [ "npm", "run", "container" ]
