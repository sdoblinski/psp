FROM node:alpine
RUN apk add --no-cache git
RUN apk add --no-cache openssh
COPY . .
RUN npm install
RUN npm install pm2 -g
CMD ["pm2-runtime", "start", "server.js"]