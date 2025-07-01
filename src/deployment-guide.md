# Deployment Guide for Japan Highly Skilled Professional Visa Calculator

This guide provides several options for deploying your Vite React application to make it publicly accessible.

## Prerequisites

Before deploying, ensure you have:

1. An account with your chosen hosting provider
2. Node.js and npm installed on your development machine
3. Git installed (if using Git-based deployments)

## Option 1: Cloudtype (Korean Cloud Platform)

Cloudtype is a Korean cloud platform that makes deployment simple with Docker support.

### Steps:

1. **Sign up for Cloudtype:**
   - Visit [cloudtype.io](https://cloudtype.io)
   - Create an account

2. **Connect your GitHub repository:**
   - Push your code to GitHub
   - Connect your GitHub account to Cloudtype

3. **Create a new project:**
   - Select "Web Application"
   - Choose your GitHub repository
   - Select the branch to deploy (usually `main`)

4. **Configure build settings:**
   - **Build Command:** `npm run build`
   - **Start Command:** Not needed (uses Dockerfile)
   - **Port:** 80 (configured in nginx.conf)

5. **Environment Variables (if needed):**
   - `VITE_BASE_URL=/`
   - `VITE_APP_NAME=Japan Visa Calculator`

6. **Deploy:**
   - Click "Deploy" button
   - Wait for the build and deployment process

7. **Access your app:**
   - Cloudtype will provide a URL like: `https://your-app-name.cloudtype.app`

### Benefits of Cloudtype:
- Korean service with Korean support
- Docker-based deployment
- Automatic HTTPS
- Easy scaling
- Reasonable pricing

## Option 2: Static Site Hosting (Recommended)

Since this is a client-side only React application, you can deploy it as a static site using one of these platforms:

### GitHub Pages

1. **Build your application:**
   ```bash
   npm run build
   ```

2. **Create a new GitHub repository** for your project.

3. **Install the gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Add deployment scripts** to your package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

5. **Configure your base URL** in vite.config.ts:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   });
   ```

6. **Deploy your application:**
   ```bash
   npm run deploy
   ```

7. **Enable GitHub Pages** in your repository settings.

### Netlify

1. **Create a Netlify account** at [netlify.com](https://www.netlify.com/).

2. **Build your application:**
   ```bash
   npm run build
   ```

3. **Deploy using the Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

   Alternatively, connect your GitHub repository to Netlify for automatic deployments.

4. **Configure build settings** in Netlify:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com/).

2. **Install the Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy your application:**
   ```bash
   vercel
   ```

   Follow the prompts to set up your project.

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Option 3: Containerized Deployment

### Docker

1. **Create a Dockerfile** in your project root:
   ```dockerfile
   # Build stage
   FROM node:20-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf** for proper SPA routing:
   ```nginx
   server {
     listen 80;
     server_name _;
     root /usr/share/nginx/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Build and run your Docker container:**
   ```bash
   docker build -t visa-calculator .
   docker run -p 8080:80 visa-calculator
   ```

4. Deploy to a container hosting service like:
   - Google Cloud Run
   - AWS ECS/Fargate
   - Azure Container Instances

## Option 4: Traditional Web Hosting

If you prefer traditional web hosting:

1. **Build your application:**
   ```bash
   npm run build
   ```

2. **Upload the contents** of the `dist` directory to your web hosting service using FTP/SFTP.

3. **Configure your server** for SPA routing if needed (redirect all requests to index.html).

## Configuration Considerations

### Environment Variables

If you need to configure environment variables for different deployments:

1. Create `.env`, `.env.production`, and `.env.development` files as needed.
2. Prefix environment variables with `VITE_` to make them accessible in your app.
3. Access them with `import.meta.env.VITE_VARIABLE_NAME`.

### Custom Domain Setup

Most hosting providers allow you to configure a custom domain:

1. Purchase a domain from a domain registrar (Namecheap, GoDaddy, Google Domains, etc.).
2. Configure DNS settings according to your hosting provider's instructions.
3. Set up HTTPS certificates (usually automated with services like Netlify, Vercel, or GitHub Pages).

## Post-Deployment Verification

After deploying your application:

1. Verify all functionality works as expected
2. Test on different browsers and devices
3. Check for any console errors
4. Ensure all assets are loading correctly

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)