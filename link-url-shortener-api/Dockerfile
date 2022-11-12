FROM node:19
MAINTAINER adeel_zammit

# Placing application in there
WORKDIR /app

# Copy files in current directory into container /app directory
COPY . /app

# Install relevant packages
RUN npm install 
RUN npm install cookie-parser --save

# Tells the docker inside the container what ports the application can expose. 
EXPOSE 8000

# Run container
RUN npm run build
ENTRYPOINT npm run start
