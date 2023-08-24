#FROM node
# Build stage
FROM node:18-alpine as build

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install -g sequelize && npm i pg pg-hstore
RUN npm install -g bcrypt && npm link bcrypt
# copy source code
COPY . .

# expose port 8080
EXPOSE 8080

# start app
CMD ["npm", "run", "dev"]

