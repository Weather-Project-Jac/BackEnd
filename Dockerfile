FROM node:alpine

WORKDIR /src/

COPY . .

USER node

EXPOSE 3000

CMD [ "node", "index.js" ]