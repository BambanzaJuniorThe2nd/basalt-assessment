# First stage to build the client and server
FROM node:18.12.1-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files for the server
COPY server/package.json server/package-lock.json ./server/

# Install the dependencies for the server
RUN cd server && npm ci

# Copy the source code for the server
COPY server/ ./server/

# Build the server
RUN cd server && npm run build

# Second stage to run the app
FROM node:18.12.1-alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the first stage
COPY --from=builder /app/server/dist ./dist

# Copy the package.json and package-lock.json files for the server
COPY server/.env server/package.json server/package-lock.json ./

# Install the production dependencies for the server
RUN npm ci --production && npm cache clean --force

# Start the Node.js application using npm start
CMD ["npm", "start"]