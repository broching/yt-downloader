# syntax=docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# --------------------
# Build stage
# --------------------
FROM base AS build

# Install packages needed to build node modules + ffmpeg
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
        build-essential \
        node-gyp \
        pkg-config \
        python-is-python3 \
        ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY . .

# Make the Linux yt-dlp binary executable
RUN chmod +x ./bin/yt-dlp_linux

# --------------------
# Final stage for app image
# --------------------
FROM base

# Install ffmpeg in the final image too
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build /app /app

# Expose the backend port
EXPOSE 8080

# Start the server by default
CMD ["npm", "run", "start"]
