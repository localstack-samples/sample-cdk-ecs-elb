FROM node:20-alpine3.17

RUN mkdir -p /app
WORKDIR /app

COPY app/package.json .
RUN npm install

COPY app .

EXPOSE 3000

CMD [ "node", "--watch", "server.js" ]