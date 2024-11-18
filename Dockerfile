FROM node:18-alpine as build
WORKDIR /app
COPY . .

ARG VITE_API_URL

ENV VITE_API_URL $VITE_API_URL

RUN echo $VITE_API_URL

RUN yarn install
RUN yarn run build

FROM socialengine/nginx-spa:latest as deploy
COPY --from=build ./dist /app
RUN chmod -R 777 /app