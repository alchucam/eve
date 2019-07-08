# build environment

FROM node:latest as build-stage

COPY . /app

WORKDIR /app

RUN yarn install
RUN yarn build

# production environment

FROM nginx

COPY --from=build-stage /app/target /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 3000

COPY --from=build-stage /app/run.sh /

RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]