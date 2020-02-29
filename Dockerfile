FROM node:10-alpine

### for vpn
#ENV SELF_SIGNED_CERT_IN_CHAIN=true
#ENV NODE_TLS_REJECT_UNAUTHORIZED=0
#RUN npm config set strict-ssl false

ENV TZ=Asia/Shanghai

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add tzdata

RUN npm install

COPY . .

CMD [ "node", "index.js" ]
