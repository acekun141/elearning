FROM node:14-alpine as builder

# copy the package.json to install dependencies
COPY package.json yarn.lock ./

# Install the dependencies and make the folder
RUN yarn install --silent && mkdir /react-ui && mv ./node_modules ./react-ui 

WORKDIR /react-ui

COPY craco.config.js .

COPY package.json .

COPY public ./public/

COPY src ./src/

# RUN yarn add react-script --silent
RUN npm install -g serve --silent

RUN yarn build

CMD serve -s build
