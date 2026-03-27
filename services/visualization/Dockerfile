FROM node:22-alpine

RUN mkdir -p /home/node/app/

WORKDIR /home/node/app

COPY ./node_modules /home/node/app/node_modules
COPY ./out /home/node/app/out
COPY ./package.json /home/node/app/package.json
COPY ./config /home/node/app/config

EXPOSE 8080
CMD [ "npm", "run", "start-js"]
