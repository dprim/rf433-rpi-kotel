FROM node:16-alpine

RUN apk add make g++ wiringpi-dev

WORKDIR /app

VOLUME /app/node_modules