FROM alpine
MAINTAINER rl
RUN apk add --update nodejs nodejs-npm

# Copy app to /src
COPY . /src
WORKDIR /src

# Install app and dependencies into /src
RUN npm install

EXPOSE 8080

CMD npm start
