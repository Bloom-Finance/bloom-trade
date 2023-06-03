FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat git python3 make g++
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile  --legacy-peer-deps

# Stage 2: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy the built dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the app source code
COPY . .


RUN  yarn add --exact --cwd /app --dev @types/react

# Build the app
RUN yarn run build 
# Stage 3: Create the production image
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat git python3 make g++
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install the production dependencies
COPY --from=deps /app/package*.json ./
RUN yarn install --frozen-lockfile --production

# Expose the appropriate port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
