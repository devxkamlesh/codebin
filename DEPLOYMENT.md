# CodeBin Deployment Guide

This guide provides step-by-step instructions for deploying the CodeBin application to Firebase Hosting and setting up all necessary services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Environment Configuration](#environment-configuration)
4. [Local Testing](#local-testing)
5. [Production Deployment](#production-deployment)
6. [Custom Domain Setup](#custom-domain-setup)
7. [GitHub Actions CI/CD](#github-actions-cicd)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js (v16.0.0 or later)
- npm or yarn
- Git
- Firebase account
- GitHub account (for CI/CD)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "codebin-prod")
4. Configure Google Analytics (recommended)
5. Click "Create project"

### 2. Enable Required Services

#### Authentication

1. In the Firebase console, go to "Authentication"
2. Click "Get started"
3. Enable the "Google" sign-in provider
4. Add your domain to the authorized domains list

#### Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Start in production mode
4. Choose a location closest to your target users

#### Storage

1. Go to "Storage"
2. Click "Get started"
3. Start in production mode
4. Choose the same location as your Firestore database

### 3. Register Web App

1. In the Firebase console, click the gear icon and select "Project settings"
2. Under "Your apps", click the web icon (</>) 
3. Register your app with a nickname (e.g., "CodeBin Web")
4. Copy the Firebase configuration object for later use

## Environment Configuration

Create a `.env` file in the root directory with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Local Testing

Before deploying to production, test your application with Firebase emulators:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   
   Select:
   - Firestore
   - Hosting
   - Storage
   - Emulators

4. Start the emulators:
   ```bash
   firebase emulators:start
   ```

5. In another terminal, start the development server:
   ```bash
   npm run dev
   ```

6. Test your application thoroughly with the emulators.

## Production Deployment

### 1. Build the Production Version

```bash
npm run build
```

This creates a `dist` directory with optimized production files.

### 2. Deploy to Firebase Hosting

```bash
firebase deploy
```

This deploys:
- Hosting configuration
- Firestore rules and indexes
- Storage rules

### 3. Verify Deployment

1. Visit the provided Firebase Hosting URL
2. Test all functionality
3. Check for any console errors

## Custom Domain Setup

### 1. Add Custom Domain in Firebase

1. In the Firebase console, go to "Hosting"
2. Click "Add custom domain"
3. Enter your domain name (e.g., codebin.io)
4. Follow the verification steps

### 2. Configure DNS

Add the following records to your domain's DNS settings:

1. For the root domain (codebin.io):
   - Type: A
   - Value: Firebase IP addresses (provided in the console)

2. For www subdomain (www.codebin.io):
   - Type: CNAME
   - Value: Your Firebase Hosting URL (e.g., codebin-prod.web.app)

### 3. Set Up SSL

Firebase automatically provisions SSL certificates for your custom domains.

## GitHub Actions CI/CD

The repository includes GitHub Actions workflows for continuous deployment:

### Setup GitHub Secrets

Add the following secrets to your GitHub repository:

1. `FIREBASE_API_KEY`
2. `FIREBASE_AUTH_DOMAIN`
3. `FIREBASE_PROJECT_ID`
4. `FIREBASE_STORAGE_BUCKET`
5. `FIREBASE_MESSAGING_SENDER_ID`
6. `FIREBASE_APP_ID`
7. `FIREBASE_SERVICE_ACCOUNT` (Generate from Firebase Project Settings > Service accounts > Generate new private key)

### Workflow Files

Two workflow files are included:

1. `.github/workflows/firebase-hosting-merge.yml`
   - Deploys to production when merging to main branch

2. `.github/workflows/firebase-hosting-pull-request.yml`
   - Creates preview deployments for pull requests

## Monitoring and Analytics

### Firebase Analytics

1. In the Firebase console, go to "Analytics"
2. View user engagement metrics
3. Set up custom events for important user actions

### Performance Monitoring

1. In the Firebase console, go to "Performance"
2. Monitor page load times and other metrics
3. Set up custom traces for critical user flows

### Error Tracking

1. In the Firebase console, go to "Crashlytics"
2. Monitor JavaScript errors
3. Set up alerts for critical errors

## Troubleshooting

### Common Issues

1. **Deployment Failed**
   - Check Firebase CLI logs
   - Verify Firebase project permissions
   - Check build output for errors

2. **Authentication Issues**
   - Verify authorized domains in Firebase Authentication
   - Check browser console for auth errors
   - Verify environment variables

3. **Firestore/Storage Access Denied**
   - Review security rules
   - Check user authentication state
   - Verify data structure matches rules expectations

### Getting Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [GitHub Issues](https://github.com/yourusername/codebin/issues) 