FROM node:8-alpine

RUN apk update && \
    apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing vips-tools vips-dev fftw-dev gcc g++ make libc6-compat && \
    apk add git && \
    apk add python && \
    rm -rf /var/cache/apk/*

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/app

#install gatsby global
RUN npm install --global gatsby --no-optional gatsby@1.9 

ENV PATH="${PATH}:/usr/local/bin/gatsby"

COPY package.json package-lock.json ./
RUN npm install 

COPY . ./
RUN npm run build

CMD ["npm", "run", "serve" ]

EXPOSE 9000