FROM node:22

# https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-stable
ARG CHROME_VERSION="138.0.7204.183-1"

RUN apt-get update

#install jdk
RUN apt-get install -y default-jdk
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

#install google-chrome
RUN wget https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb
RUN apt-get install -y ./google-chrome-stable_${CHROME_VERSION}_amd64.deb

RUN npm install -g corepack && corepack enable && corepack prepare yarn@4.7.0 --activate