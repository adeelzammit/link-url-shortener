FROM node:19
MAINTAINER adeel_zammit

# Placing application in there
WORKDIR /app

# Copy files in current directory into container /app directory
COPY . /app

# Install relevant packages
RUN npm install 

# Tells the docker inside the container what ports the application can expose. 
EXPOSE 3000

# Create production build
RUN npm run build

# install command and run production build
RUN npm install -g serve

ENTRYPOINT serve -s build

