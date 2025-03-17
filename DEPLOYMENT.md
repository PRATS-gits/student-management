# Deployment Guide for Student Management Angular Application

This guide outlines the steps to build and deploy the Student Management Angular application to various hosting platforms.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Angular CLI installed globally

## Building for Production

To create a production build of the application:

```bash
# Using npm
npm run build:prod

# Or using Angular CLI directly
ng build --configuration production
```

The build artifacts will be stored in the `dist/student-management-angular/` directory.

## Deployment Options

### 1. Firebase Hosting

#### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account

#### Steps
1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Select your project or create a new one
   - Set "dist/student-management-angular" as the public directory
   - Configure as a single-page app (SPA)
   - Do not overwrite index.html

3. Deploy to Firebase:
   ```bash
   npm run deploy
   ```

### 2. GitHub Pages

#### Prerequisites
- Git repository on GitHub

#### Steps
1. Install gh-pages package:
   ```bash
   npm install gh-pages --save-dev
   ```

2. Add these scripts to package.json:
   ```json
   "scripts": {
     "build:github": "ng build --configuration production --base-href=/your-repo-name/",
     "deploy:github": "npm run build:github && npx gh-pages -d dist/student-management-angular"
   }
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy:github
   ```

### 3. Netlify

#### Prerequisites
- Netlify account

#### Steps
1. Create a `netlify.toml` file in the root of your project:
   ```toml
   [build]
     publish = "dist/student-management-angular"
     command = "ng build --configuration production"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy via Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

   Or connect your GitHub repository to Netlify for continuous deployment.

## Environment-Specific Configuration

For different environments, update the environment files in `src/environments/`.

## Post-Deployment Verification

After deployment, verify:

1. Application loads correctly
2. All routes work properly (test navigation)
3. Data persistence works (localStorage)
4. Theme switching works
5. Responsive layout works on various devices

## Troubleshooting Common Issues

### Routing Issues
- Ensure your hosting platform is configured to redirect all requests to index.html
- Check base href in index.html is correct for your deployment path

### Asset Loading Issues
- Verify that assets are referenced with relative paths
- Check if assets are included in the Angular build configuration

### LocalStorage Issues
- Test in private/incognito mode to ensure no previous data is interfering
- Verify localStorage is enabled in the browser

## Performance Optimization

- Run Lighthouse audits to identify performance issues
- Use the bundle analyzer to identify large packages:
  ```bash
  npm run analyze
  ```
