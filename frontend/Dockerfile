FROM node:latest AS build

WORKDIR /usr/app
COPY frontend frontend
COPY common common

WORKDIR /usr/app/frontend
RUN npm i && npm run build

FROM node:latest

COPY --from=build /usr/app/frontend/build/ /app
COPY --from=build /usr/app/frontend/.npmrc /app
COPY --from=build /usr/app/frontend/package.json /app
COPY --from=build /usr/app/frontend/package-lock.json /app

WORKDIR /app
RUN npm i --production

WORKDIR /app

ENTRYPOINT ["node", "index.js"]
