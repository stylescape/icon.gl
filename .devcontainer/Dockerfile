# syntax=docker/dockerfile:1.4


# Base Image
# =============================================================================

FROM ghcr.io/stylescape/stylescape-devcontainer/devcontainer:latest


# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 3000

# Start Command
# =============================================================================
# Define the command to run your app
# CMD [ "npm", "start" ]
CMD ["/usr/local/bin/start.sh"]