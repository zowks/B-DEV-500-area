FROM node:lts AS build

# npm@10.9.0 may freeze when installing dependencies
RUN npm install -g npm@10.8.3

WORKDIR /tmp/app

COPY .npmrc .npmrc

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY apps/frontend/ apps/frontend/

COPY packages/common/ packages/common/

RUN npm install

WORKDIR /tmp/app/apps/frontend

RUN npm run build

FROM node:lts AS serve

# npm@10.9.0 may freeze when installing dependencies
RUN npm install -g npm@10.8.3

COPY --from=build /tmp/app/.npmrc /app/.npmrc

COPY --from=build /tmp/app/package.json /app/package.json

COPY --from=build /tmp/app/package-lock.json /app/package-lock.json

COPY --from=build /tmp/app/apps/frontend/build/ /app/apps/frontend/build/

COPY --from=build /tmp/app/apps/frontend/package.json /app/apps/frontend/package.json

WORKDIR /app

RUN npm install --omit=dev

WORKDIR /app/apps/frontend

ENTRYPOINT ["node", "build/index.js"]
