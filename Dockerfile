FROM socialengine/nginx-spa:latest as deploy
COPY ./build /app
RUN chmod -R 777 /app