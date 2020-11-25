# base image
FROM node:12-alpine AS alpine

WORKDIR /app

# dependencies
COPY package.json .
RUN npm install 
COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]