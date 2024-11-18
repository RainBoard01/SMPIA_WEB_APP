FROM node:16-alpine as build
WORKDIR /app
COPY . .

ARG VITE_API_URL

ENV VITE_API_URL $VITE_API_URL

RUN echo $VITE_API_URL

RUN npm ci
RUN npm run build

FROM socialengine/nginx-spa:latest as deploy
COPY ./build /app
RUN chmod -R 777 /app