# FROM node:lts-alpine AS base

# WORKDIR /app

# COPY package.json pnpm-lock.yaml ./

# RUN npm i -g pnpm@latest
# RUN pnpm install

# COPY . .

# RUN pnpm build

# FROM node:lts-alpine AS production

# WORKDIR /app

# COPY --from=base /app/package*.json ./
# COPY --from=base /app/.next ./.next
# COPY --from=base /app/public ./public
# COPY --from=base /app/node_modules ./node_modules
# COPY --from=base /app/next.config.mjs ./next.config.mjs

# RUN npm i -g pnpm@latest

# EXPOSE 3000

# ENV AWS_ACCESS_KEY="" \
#   AWS_SECRET_KEY="" \
#   AWS_REGION="" \
#   ANTHROPIC_API_KEY="" \
#   AZURE_OPENAI_API_KEY="" \
#   AZURE_OPENAI_ENDPOINT="" \
#   AZURE_OPENAI_DEPLOY_INSTANCE_NAME="" \
#   COHERE_API_KEY="" \
#   FIREWORKS_API_KEY="" \
#   GOOGLE_API_KEY="" \
#   GROQ_API_KEY="" \
#   HUGGINGFACE_API_KEY="" \
#   MISTRAL_API_KEY="" \
#   OPENAI_API_KEY="" \
#   OPENAI_API_ENDPOINT="" \
#   PERPLEXITY_API_KEY="" \
#   PERPLEXITY_ENDPOINT="" 

# CMD ["pnpm", "start"]


# Base image
FROM node:lts AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Add environment variables if needed
# ENV NEXT_PUBLIC_API_URL=your_api_url
RUN pnpm build

# Production stage
FROM node:lts-alpine AS production
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]