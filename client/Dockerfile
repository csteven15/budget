# base image
FROM node:12-alpine as client

WORKDIR /app

# dependencies
COPY package*.json ./
RUN npm install
COPY . .

# build
RUN npm run build

# pull and run nginx
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=client /app/build /usr/share/nginx/html