FROM node:alpine

# ENV USER user
# ENV PSWD password
RUN mkdir src

WORKDIR /src/

COPY . .

RUN npm install

USER node

EXPOSE 3000

CMD [ "node", "index.js" ]