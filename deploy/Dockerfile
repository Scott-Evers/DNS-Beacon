FROM node:current-alpine3.17

# Install basic development tools
RUN apk update
RUN apk add git

ADD src/ /app

WORKDIR /app

RUN npm install

ENTRYPOINT [ "node", "index.js" ]