FROM node:8.2.1-alpine

RUN apk add --update \
      git

WORKDIR /redux-hist
COPY package.json package-lock.json ./
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc && npm install
COPY tsconfig.json tslint.json ./
COPY src src
COPY test test
RUN npm run build

CMD npm test
