FROM node:20-bookworm

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install AWS CDK CLI
RUN npm install -g aws-cdk

# Set working directory
WORKDIR /workspaces/next-amplify-starter-kit

# Create non-root user workspace
RUN mkdir -p /home/node/.pnpm-store && chown -R node:node /home/node

# Switch to non-root user
USER node

# Set pnpm store location
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
