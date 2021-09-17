# base image
FROM node:12-alpine AS alpine

WORKDIR /app

# dependencies
COPY package.json .
RUN yarn install 
COPY . .

# build
RUN yarn run build

EXPOSE 3001

# run 'yarn run start:prod' when the container starts
CMD ["yarn", "run", "start:prod"]