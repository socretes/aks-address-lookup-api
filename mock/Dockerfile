FROM alpine

ENV MOUNTEBANK_VERSION=2.2.1

RUN apk add --update nodejs-lts && \
    apk add --update npm
RUN npm install -g mountebank@${MOUNTEBANK_VERSION} --production

COPY ./imposters /imposters

EXPOSE 2525 8090
ENTRYPOINT ["mb"]
#CMD ["start", "--configfile /imposters/imposters.ejs --allowInjection"]
CMD ["start"]