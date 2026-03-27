FROM node:22-alpine

RUN mkdir -p /home/node/app/
RUN rm -rf /usr/local/share/.cache

WORKDIR /home/node/app

COPY ./node_modules /home/node/app/node_modules
COPY ./out /home/node/app/out
COPY ./package.json /home/node/app/package.json

EXPOSE 8086
CMD [ "npm", "run", "start-prod"]
