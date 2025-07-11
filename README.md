# CodeBin

<p align="center">
  <img src="public/codebin-logo.png" alt="CodeBin Logo" width="200" />
</p>

<p align="center">
  A modern code snippet sharing platform built with React, TypeScript, and Firebase.
</p>

<p align="center">
  <a href="https://codebin.io">View Demo</a> ·
  <a href="https://github.com/devxkamlesh/codebin/issues">Report Bug</a> ·
  <a href="https://github.com/devxkamlesh/codebin/issues">Request Feature</a>
</p>

## ✨ Features

- **Code Snippet Management**: Create, edit, and organize your code snippets
- **Syntax Highlighting**: Support for 100+ programming languages
- **Code Execution**: Run JavaScript, Python, and other languages directly in the browser
- **User Authentication**: Secure Google authentication
- **Public/Private Snippets**: Control who can see your snippets
- **Sharing**: Share snippets via unique links and social media
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Search & Filter**: Find snippets by language, category, or keywords
- **User Profiles**: View and follow other developers

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Code Execution**: Sandboxed iframes, Pyodide (WebAssembly)
- **Deployment**: Firebase Hosting

## 📋 Prerequisites

- Node.js (v16.0.0 or later)
- npm or yarn
- Firebase account

## 🛠️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/codebin.git
cd codebin
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up Firebase**

- Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
- Enable Authentication (Google provider)
- Create a Firestore database
- Add a web app to your Firebase project
- Copy the Firebase configuration

4. **Configure environment variables**

Create a `.env` file in the root directory:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**

Navigate to `http://localhost:5173` to see the app running.

## 🔥 Deployment

### Firebase Hosting Setup

1. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**

```bash
firebase login
```

3. **Initialize Firebase in your project**

```bash
firebase init
```

Select the following options:
- Firestore
- Hosting
- Storage (if needed)
- Select your Firebase project
- Use `dist` as your public directory
- Configure as a single-page app
- Set up GitHub Actions for deployment (optional)

4. **Build the project**

```bash
npm run build
# or
yarn build
```

5. **Deploy to Firebase**

```bash
firebase deploy
```

### Custom Domain Setup

1. Go to the Firebase console > Hosting
2. Click "Add custom domain"
3. Follow the steps to verify domain ownership
4. Update DNS settings with your domain provider

## 🗄️ Database Structure

```
/snippets/{snippetId}
  - title: string
  - description: string
  - code: string
  - language: string
  - category: string
  - tags: array
  - isPublic: boolean
  - authorId: string
  - authorName: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - viewCount: number
  - likeCount: number
  - forkCount: number

/users/{userId}
  - displayName: string
  - email: string
  - photoURL: string
  - bio: string
  - website: string
  - github: string
  - twitter: string
  - snippetCount: number
  - followers: array
  - following: array
  - createdAt: timestamp
```

## 🔒 Security Rules

Here are the recommended Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Snippets collection
    match /snippets/{snippetId} {
      // Anyone can read public snippets
      allow read: if resource.data.isPublic == true;
      
      // Authenticated users can create snippets
      allow create: if request.auth != null;
      
      // Only the author can update or delete their snippets
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
      
      // Authors can read their own private snippets
      allow read: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Users collection
    match /users/{userId} {
      // Public profiles are readable by anyone
      allow read: if true;
      
      // Users can only write to their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Progressive Web App

CodeBin is set up as a Progressive Web App (PWA), allowing users to install it on their devices for offline access. The service worker caches assets and provides a seamless experience even with intermittent connectivity.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/codebin](https://github.com/yourusername/codebin)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [CodeMirror](https://codemirror.net/)
- [Pyodide](https://pyodide.org/)
