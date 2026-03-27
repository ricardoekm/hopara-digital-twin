FROM node:22-slim

RUN npm i -g http-server

RUN mkdir -p /home/node/app/
WORKDIR /home/node/app

ARG BUILD_DIR=./build
COPY $BUILD_DIR /home/node/app

COPY ./docker-entrypoint.sh /home/node/app/docker-entrypoint.sh
RUN chmod +x /home/node/app/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/home/node/app/docker-entrypoint.sh"]
CMD [ "http-server", ".", "-p 3000", "-c-1", "-P http://localhost:3000/?"]
