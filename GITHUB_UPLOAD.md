# Uploading CodeBin to GitHub

Since Git is not installed on your system, we'll use GitHub's web interface to upload your project. Follow these steps to get your CodeBin project on GitHub.

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter "codebin" as the Repository name
4. Add a description: "A modern code snippet sharing platform built with React, TypeScript, and Firebase"
5. Choose "Public" visibility (or Private if you prefer)
6. Check the box for "Add a README file"
7. Click "Create repository"

## Step 2: Upload Your Files to GitHub

### For Small Files and Folders:

1. In your new repository, click the "Add file" button and select "Upload files"
2. Drag and drop files from your local CodeBin project or click "choose your files" to select them
3. You may need to upload files in batches if you have many files
4. Add a commit message like "Initial upload of CodeBin project"
5. Click "Commit changes"

### For Multiple Uploads:

You'll likely need to upload your project in multiple batches due to GitHub's file upload limitations. Here's a suggested approach:

1. First upload: Core files (README.md, package.json, configuration files)
2. Second upload: Source code (src folder)
3. Third upload: Public assets (public folder)
4. Fourth upload: Any remaining files

## Step 3: Create the Required GitHub Actions Workflows

After uploading your main project files, you'll need to create the GitHub Actions workflow files:

1. In your repository, click "Add file" and select "Create new file"
2. For the filename, enter: `.github/workflows/firebase-hosting-merge.yml`
3. Copy and paste the contents of the workflow file we created earlier
4. Click "Commit new file"
5. Repeat the process for `.github/workflows/firebase-hosting-pull-request.yml`

## Step 4: Set Up GitHub Secrets

To enable GitHub Actions deployments, you'll need to add secrets:

1. Go to your repository's "Settings" tab
2. Click on "Secrets and variables" → "Actions" in the left sidebar
3. Click "New repository secret"
4. Add the following secrets one by one:
   - FIREBASE_API_KEY
   - FIREBASE_AUTH_DOMAIN
   - FIREBASE_PROJECT_ID
   - FIREBASE_STORAGE_BUCKET
   - FIREBASE_MESSAGING_SENDER_ID
   - FIREBASE_APP_ID
   - FIREBASE_SERVICE_ACCOUNT (paste the entire JSON content from your Firebase service account key)

## Step 5: Verify Your Repository

1. Go back to the main page of your repository
2. Check that all files and folders have been uploaded correctly
3. Ensure the README.md is displaying properly
4. Verify that the GitHub Actions workflows are set up

## Next Steps

Once your code is on GitHub, you can:

1. Set up Firebase hosting by following the instructions in DEPLOYMENT.md
2. Share your repository URL with others
3. Enable GitHub Pages if you want a simple demo site
4. Clone the repository locally once you install Git

Remember that using the web interface is convenient for the initial upload, but for ongoing development, installing Git on your local machine will provide a much better workflow. 