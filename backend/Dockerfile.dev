FROM node:20-alpine

# Set working directory
WORKDIR /server

# Install dependencies first (better Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 9000 7001

# Start with migrations and then the development server
CMD ["./start.sh"]