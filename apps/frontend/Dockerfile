FROM node:latest AS build

WORKDIR /tmp/app
COPY apps/frontend apps/frontend
COPY packages/common packages/common

WORKDIR /tmp/app/frontend
RUN npm i && npm run build

FROM node:latest

COPY --from=build /tmp/app/frontend/build/ /app
COPY --from=build /tmp/app/frontend/.npmrc /app
COPY --from=build /tmp/app/frontend/package.json /app
COPY --from=build /tmp/app/frontend/package-lock.json /app

WORKDIR /app
RUN npm i --production

WORKDIR /app

ENTRYPOINT ["node", "index.js"]
