# base image
FROM node:12-alpine AS alpine

WORKDIR /app

# dependencies
COPY package.json .
RUN npm install 
COPY . .

# build
RUN npm run build

EXPOSE 3001

# run 'npm run start' when the container starts
CMD ["npm", "run", "start"]