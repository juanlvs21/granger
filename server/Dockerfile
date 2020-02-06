FROM node

COPY [".", "/usr/src/granger/server"]

WORKDIR /usr/src/granger/server

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "dev"]