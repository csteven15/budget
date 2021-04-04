# base image
FROM node:12-alpine as client

WORKDIR /app

# dependencies
COPY package*.json ./
RUN yarn install
COPY . .

# build
RUN yarn run lint
RUN yarn run build

# pull and run nginx
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=client /app/build /usr/share/nginx/html