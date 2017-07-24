FROM node:8.1.4

WORKDIR /redux-hist
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./src/ ./test/ ./
RUN ls -al
RUN npm run build

CMD npm test
