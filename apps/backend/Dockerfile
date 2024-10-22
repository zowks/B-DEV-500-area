FROM node:lts AS base

LABEL org.opencontainers.image.source=https://github.com/zowks/B-DEV-500-area

# npm@10.9.0 may freeze when installing dependencies
RUN npm install -g npm@10.8.3

FROM base AS setup

WORKDIR /tmp/app/

COPY .npmrc .npmrc

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY apps/backend/package.json apps/backend/package.json

COPY apps/backend/tsconfig.build.json apps/backend/tsconfig.build.json

COPY apps/backend/tsconfig.json apps/backend/tsconfig.json

COPY apps/backend/src/ apps/backend/src/

COPY apps/backend/prisma/ apps/backend/prisma/

RUN npm install

FROM setup AS build

WORKDIR /tmp/app/apps/backend

RUN npm run prisma:generate

RUN npm run build

FROM build AS serve

COPY --from=build /tmp/app/.npmrc /app/.npmrc

COPY --from=build /tmp/app/package.json /app/package.json

COPY --from=build /tmp/app/package-lock.json /app/package-lock.json

COPY --from=build /tmp/app/apps/backend/ /app/apps/backend/

WORKDIR /app

RUN npm install --omit=dev

WORKDIR /app/apps/backend

ENTRYPOINT [ "npm", "run", "container" ]
