FROM node:16 as develop

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn


FROM develop AS build
COPY . .
RUN yarn build

FROM nginx:alpine as prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

