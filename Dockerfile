FROM alpine
MAINTAINER rl
RUN apk add --update nodejs nodejs-npm

# Copy app to /src
COPY . /src
WORKDIR /src

ENV ADDRESS_LOOKUP_REMOTE_URL=http://host.docker.internal:8090/mock/address-lookup-api

# Install app and dependencies into /src
RUN npm install

EXPOSE 8080

CMD npm start
