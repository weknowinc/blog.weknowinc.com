FROM node:8

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/app

#install gatsby global
RUN npm install --global gatsby --no-optional gatsby@1.9 

ENV PATH="${PATH}:/usr/local/bin/gatsby"

COPY package.json package-lock.json ./
RUN npm install 

COPY . ./
RUN npm run build

CMD ["npm", "run", "serve", "--port", "9000" ]

CMD tail -f /dev/null

EXPOSE 9000