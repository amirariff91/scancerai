# ScancerAI Docker Deployment Guide

This guide explains how to deploy ScancerAI using Docker for production environments.

## Prerequisites

- Docker installed on your server (v20.10.0 or higher recommended)
- Docker Compose installed (v2.0.0 or higher recommended)
- At least 2GB of free RAM on your server
- Git access to the repository

## Deployment Options

You have three options for deploying ScancerAI with Docker:

### Option 1: Using the Deployment Script

1. Make the deployment script executable:
   ```bash
   chmod +x docker-deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./docker-deploy.sh
   ```

3. The script will build the Docker image, create a container, and start the application.

### Option 2: Using Docker Compose

1. Deploy with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. To stop the application:
   ```bash
   docker-compose down
   ```

### Option 3: Manual Docker Commands

1. Build the Docker image:
   ```bash
   docker build -t scancerai:latest .
   ```

2. Run the container:
   ```bash
   docker run -d --name scancerai-app -p 3000:3000 -e NODE_ENV=production scancerai:latest
   ```

3. To stop the container:
   ```bash
   docker stop scancerai-app
   ```

## Environment Variables

You can customize the deployment by setting environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port the application will run on | 3000 |
| NODE_ENV | The Node.js environment | production |

To set environment variables when using Docker Compose, edit the `docker-compose.yml` file.

## Health Checks

The Docker container includes a health check that verifies the application is running correctly.
You can monitor the health status with:

```bash
docker inspect --format='{{.State.Health.Status}}' scancerai-app
```

## Production Considerations

1. **SSL/TLS**: For production, set up a reverse proxy (like Nginx) in front of the application to handle HTTPS.

2. **Monitoring**: Consider using monitoring tools like Prometheus and Grafana to track application health.

3. **Logs**: Access logs with:
   ```bash
   docker logs scancerai-app
   ```

4. **Backups**: Implement a backup strategy for any persistent data.

5. **Updates**: To update the application:
   ```bash
   # Pull latest code
   git pull
   
   # Rebuild and restart with Docker Compose
   docker-compose down
   docker-compose up -d --build
   ```

## Troubleshooting

If you encounter issues:

1. Check the application logs:
   ```bash
   docker logs scancerai-app
   ```

2. Verify the container is running:
   ```bash
   docker ps | grep scancerai
   ```

3. Check the container health:
   ```bash
   docker inspect --format='{{.State.Health.Status}}' scancerai-app
   ```

4. If the container fails to start, try running it in interactive mode:
   ```bash
   docker run -it --rm -p 3000:3000 scancerai:latest /bin/sh
   ```

For additional support, please refer to the project documentation or open an issue on the repository. 