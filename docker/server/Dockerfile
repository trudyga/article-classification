FROM node:12

LABEL Maintainer="Vladislav Sereda"
LABEL Author="trudygajs@gmail.com"

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn --pure-lockfile

COPY . .

EXPOSE 5000

CMD ["yarn",  "start"]