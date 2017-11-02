FROM node:9.0.0-alpine

RUN apk add --update \
      git

WORKDIR /redux-hist
COPY package.json package-lock.json ./
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc && npm install
COPY . .
RUN npm run build
ARG CODECOV_TOKEN
