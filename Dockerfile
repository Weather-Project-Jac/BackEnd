FROM node:alpine

# ENV USER user
# ENV PSWD password

WORKDIR /src/

RUN npm i

COPY . .

USER node

EXPOSE 3000

CMD [ "node", "index.js" ]