FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules ./node_modules
COPY dist ./dist
COPY .env .

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]