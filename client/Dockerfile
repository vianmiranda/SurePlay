FROM node:23-alpine as build
RUN mkdir -p /home/client
RUN mkdir -p /home/env
WORKDIR /home
COPY ./env/.env ./env/.env
#--
# caching (if changes to ./client but not package*)
COPY ./client/package*.json ./client
WORKDIR /home/client
RUN npm install
#--
COPY ./client .
RUN npm run build

FROM nginx:1.27-alpine
EXPOSE 8080
COPY ./client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /home/client/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]