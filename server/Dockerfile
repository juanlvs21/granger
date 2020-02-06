FROM node

COPY [".", "/usr/src/granger/server"]

WORKDIR /usr/src/granger/server

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]