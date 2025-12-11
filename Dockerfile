FROM node:23-alpine3.20
WORKDIR /code
COPY package.json .
RUN npm install
COPY . .


CMD [ "npm", "run","production" ]