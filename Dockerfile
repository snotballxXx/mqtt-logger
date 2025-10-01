FROM node:20-alpine

RUN apk add --no-cache tzdata

ENV TZ=Pacific/Auckland

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY index.js ./

CMD ["node", "index.js"]