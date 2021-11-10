FROM node:14-alpine

RUN mkdir -p app
WORKDIR app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]