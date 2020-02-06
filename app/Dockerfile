FROM node

COPY [".", "/usr/src/granger/app"]

WORKDIR /usr/src/granger/app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]