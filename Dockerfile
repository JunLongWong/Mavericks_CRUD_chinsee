FROM node:18-alpine3.14
WORKDIR /dist/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm","start"]