# Build stage
FROM node:lts-slim AS builder
WORKDIR /app

# Copy project files
COPY package*.json ./
RUN npm ci
COPY . .

# Import environment variables
ARG DB_TOKEN
ENV DB_TOKEN=$DB_TOKEN

ARG ALPACA_KEY
ENV ALPACA_KEY=$ALPACA_KEY

ARG ALPACA_SECRET
ENV ALPACA_SECRET=$ALPACA_SECRET

ARG BUCKET_PRIVATE_KEY
ENV BUCKET_PRIVATE_KEY=$BUCKET_PRIVATE_KEY

ARG RECAPTCHA_SECRET
ENV RECAPTCHA_SECRET=$RECAPTCHA_SECRET

ARG PASSWORD
ENV PASSWORD=$PASSWORD

ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD

# Build project
RUN npm run check
RUN npm run test -- run
RUN npm run build
RUN npm prune --omit=dev

# Production stage
FROM node:lts-slim AS production
WORKDIR /app

# Copy only the necessary files from build stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 8080
ENV PORT=8080

# Run the app
CMD ["node", "build"]
