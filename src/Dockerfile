FROM node:20-alpine3.17

# Create app directory
RUN mkdir -p /usr/src/app
# Set working directory
WORKDIR /usr/src/app
# Copy app source code
COPY app .

# Install app dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "run", "start" ]