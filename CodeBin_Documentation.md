    # CodeBin Documentation

    ## Table of Contents
    1. [Introduction](#introduction)
    2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
    3. [Architecture Overview](#architecture-overview)
    - [Tech Stack](#tech-stack)
    - [Project Structure](#project-structure)
    - [Firebase Integration](#firebase-integration)
    4. [Authentication](#authentication)
    - [Google Authentication](#google-authentication)
    - [Auth Context](#auth-context)
    - [Protected Routes](#protected-routes)
    5. [Core Features](#core-features)
    - [Creating Code Snippets](#creating-code-snippets)
    - [Viewing Snippets](#viewing-snippets)
    - [Editing Snippets](#editing-snippets)
    - [Dashboard Management](#dashboard-management)
    - [Code Running](#code-running)
    6. [Components](#components)
    - [Navigation](#navigation)
    - [Code Runner](#code-runner)
    - [UI Components](#ui-components)
    7. [Pages](#pages)
    - [Home Page](#home-page)
    - [Login Page](#login-page)
    - [Dashboard Page](#dashboard-page)
    - [New Snippet Page](#new-snippet-page)
    - [View Snippet Page](#view-snippet-page)
    - [Edit Snippet Page](#edit-snippet-page)
    - [Explore Page](#explore-page)
    - [Profile Pages](#profile-pages)
    8. [Data Models](#data-models)
    - [Snippet Model](#snippet-model)
    - [User Data](#user-data)
    9. [Advanced Features](#advanced-features)
    - [Code Execution](#code-execution)
    - [Syntax Highlighting](#syntax-highlighting)
    - [Search and Filtering](#search-and-filtering)
    10. [Deployment](#deployment)
        - [Building for Production](#building-for-production)
        - [Firebase Hosting](#firebase-hosting)
    11. [Security](#security)
        - [Authentication Rules](#authentication-rules)
        - [Firestore Rules](#firestore-rules)
    12. [Performance Optimization](#performance-optimization)
    13. [Troubleshooting](#troubleshooting)
    14. [Contributing Guidelines](#contributing-guidelines)
    15. [License](#license)

    ---

    ## Introduction

    CodeBin is a modern web application designed for developers to create, store, and share code snippets. Built with React and Firebase, it provides a clean and intuitive interface for managing code snippets with features like syntax highlighting, code execution, and sharing capabilities.

    **Key Features:**
    - Google Authentication for secure access
    - Create and save code snippets with titles, descriptions, and tags
    - Share snippets via unique links
    - Execute code directly in the browser for supported languages
    - User dashboard to manage all your snippets
    - Public exploration of shared snippets
    - Profile customization

    This documentation provides comprehensive information about the CodeBin application, including setup instructions, architecture details, and feature explanations.

    ---

    ## Getting Started

    ### Prerequisites

    Before setting up CodeBin, ensure you have the following installed:

    - Node.js (v14 or later)
    - npm or yarn
    - Git
    - A Firebase account

    ### Installation

    1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/codebin.git
    cd codebin
    ```

    2. Install dependencies:
    ```bash
    npm install
    ```

    3. Start the development server:
    ```bash
    npm run dev
    ```

    4. Open your browser and navigate to:
    ```
    http://localhost:5173
    ```

    ### Environment Setup

    Create a `.env` file in the root directory with your Firebase configuration:

    ```
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    ```

    ---

    ## Architecture Overview

    ### Tech Stack

    CodeBin is built using the following technologies:

    - **Frontend Framework**: React 19 with TypeScript
    - **Build Tool**: Vite 7
    - **Styling**: Tailwind CSS with custom components
    - **Routing**: React Router v7
    - **Backend/Database**: Firebase (Authentication, Firestore)
    - **UI Components**: Custom components with Radix UI primitives
    - **Icons**: Lucide React
    - **Animation**: Framer Motion

    ### Project Structure

    The project follows a feature-based structure:

    ```
    codebin/
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # Images and other assets
    │   ├── components/       # Reusable components
    │   │   ├── landing/      # Landing page components
    │   │   └── ui/           # UI components
    │   ├── context/          # React contexts
    │   ├── lib/              # Utility functions
    │   ├── pages/            # Page components
    │   ├── App.tsx           # Main app component
    │   ├── firebase.ts       # Firebase configuration
    │   └── main.tsx          # Entry point
    ├── .env                  # Environment variables
    └── package.json          # Dependencies and scripts
    ```

    ### Firebase Integration

    CodeBin uses Firebase for:

    1. **Authentication**: Google sign-in
    2. **Firestore Database**: Storing user data and code snippets
    3. **Hosting**: Deployment of the application

    The Firebase configuration is set up in `src/firebase.ts`:

    ```typescript
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
    apiKey: "...",
    authDomain: "project-codebin.firebaseapp.com",
    projectId: "project-codebin",
    storageBucket: "project-codebin.firebasestorage.app",
    messagingSenderId: "...",
    appId: "..."
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);

    export default app;
    ```

    ---

    ## Authentication

    ### Google Authentication

    CodeBin uses Firebase Authentication with Google as the provider. The authentication flow is handled in the `AuthContext.tsx` file.

    To sign in with Google:

    ```typescript
    async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    }
    ```

    ### Auth Context

    The `AuthContext` provides authentication state and methods throughout the application:

    ```typescript
    const AuthContext = createContext<AuthContextType | null>(null);

    export function useAuth() {
    return useContext(AuthContext) as AuthContextType;
    }
    ```

    The context provides:
    - `currentUser`: The currently authenticated user
    - `loading`: Authentication loading state
    - `signInWithGoogle`: Method to sign in with Google
    - `logout`: Method to sign out

    ### Protected Routes

    Protected routes ensure that only authenticated users can access certain pages:

    ```typescript
    function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!loading && !currentUser) {
        navigate('/login');
        }
    }, [currentUser, loading, navigate]);
    
    return currentUser ? children : null;
    }
    ```

    Usage in App.tsx:

    ```typescript
    <Route 
    path="/dashboard" 
    element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
    } 
    />
    ```

    ---

    ## Core Features

    ### Creating Code Snippets

    Users can create new code snippets with the following information:

    - Title
    - Description
    - Programming language
    - Code content
    - Category
    - Tags
    - Privacy setting (public or private)

    The snippet creation process is handled in the `NewSnippet.tsx` component.

    ### Viewing Snippets

    Snippets can be viewed by anyone if they are public, or only by the owner if they are private. The `ViewSnippet.tsx` component handles displaying snippets and provides features like:

    - Syntax highlighting
    - Code copying
    - Code execution (for supported languages)
    - Metadata display (author, creation date, etc.)

    ### Editing Snippets

    Snippet owners can edit their snippets through the `EditSnippet.tsx` component, which provides the same interface as the creation form but pre-populated with the snippet's current data.

    ### Dashboard Management

    The dashboard (`Dashboard.tsx`) provides a central place for users to:

    - View all their snippets
    - Search and filter snippets
    - Edit snippets
    - Delete snippets
    - Create new snippets

    ### Code Running

    The `CodeRunner.tsx` component allows users to execute code directly in the browser for supported languages:

    - JavaScript: Executed in a sandboxed iframe
    - Python: Executed using Pyodide (WebAssembly)
    - Ruby: Executed using Ruby.wasm
    - HTML/CSS: Rendered in an iframe

    ---

    ## Components

    ### Navigation

    The `Navbar.tsx` component provides navigation throughout the application:

    - Logo and brand
    - Navigation links
    - Authentication status and actions
    - Responsive design for mobile

    ### Code Runner

    The `CodeRunner.tsx` component is a complex component that:

    1. Loads appropriate runtime for the selected language
    2. Executes code in a sandboxed environment
    3. Captures and displays output
    4. Handles errors gracefully

    Supported languages include:
    - JavaScript
    - Python
    - Ruby
    - HTML
    - CSS

    ### UI Components

    Custom UI components in the `ui/` directory provide consistent styling:

    - `button.tsx`: Styled buttons with variants
    - `card.tsx`: Card components for displaying content

    ---

    ## Pages

    ### Home Page

    The landing page (`Home.tsx`) introduces users to CodeBin with:

    - Hero section with call-to-action
    - Feature highlights
    - How it works section
    - Testimonials
    - Footer with links

    ### Login Page

    The `Login.tsx` page provides:

    - Google authentication button
    - Error handling for authentication issues

    ### Dashboard Page

    The `Dashboard.tsx` page displays:

    - List of user's snippets
    - Search and filter functionality
    - Actions for each snippet (view, edit, delete)
    - Create new snippet button

    ### New Snippet Page

    The `NewSnippet.tsx` page provides a form for creating new snippets with:

    - Title and description fields
    - Language selection
    - Code editor
    - Category and tag inputs
    - Privacy toggle

    ### View Snippet Page

    The `ViewSnippet.tsx` page displays:

    - Snippet title and description
    - Author information
    - Creation date
    - Code with syntax highlighting
    - Copy code button
    - Run code button (for supported languages)

    ### Edit Snippet Page

    The `EditSnippet.tsx` page allows users to modify their snippets with the same interface as the creation form.

    ### Explore Page

    The `Explore.tsx` page shows:

    - Public snippets from all users
    - Filtering and sorting options
    - Trending or popular snippets

    ### Profile Pages

    The profile pages (`Profile.tsx` and `ProfileView.tsx`) show:

    - User information
    - User's public snippets
    - Account settings (for the user's own profile)

    ---

    ## Data Models

    ### Snippet Model

    The Snippet model in Firestore includes:

    ```typescript
    interface Snippet {
    id: string;             // Document ID
    title: string;          // Snippet title
    description: string;    // Optional description
    language: string;       // Programming language
    content: string;        // Code content
    category?: string;      // Optional category
    tags?: string[];        // Optional tags
    isPublic?: boolean;     // Privacy setting
    authorId: string;       // User ID of creator
    authorName: string;     // Display name of creator
    createdAt: Timestamp;   // Creation timestamp
    }
    ```

    ### User Data

    User data is stored using Firebase Authentication and includes:

    - UID
    - Display name
    - Email
    - Profile picture URL

    ---

    ## Advanced Features

    ### Code Execution

    CodeBin supports running code directly in the browser using:

    1. **JavaScript**: Executed in a sandboxed iframe with console output capture
    2. **Python**: Executed using Pyodide (Python compiled to WebAssembly)
    3. **Ruby**: Executed using Ruby.wasm
    4. **HTML/CSS**: Rendered in an iframe with Tailwind CSS support

    The code execution is implemented in the `CodeRunner.tsx` component.

    ### Syntax Highlighting

    Code snippets are displayed with syntax highlighting based on the selected language.

    ### Search and Filtering

    The dashboard and explore pages provide:

    - Text search across titles, descriptions, and tags
    - Language filtering
    - Category filtering
    - Sort options (newest, oldest, etc.)

    ---

    ## Deployment

    ### Building for Production

    To build the application for production:

    ```bash
    npm run build
    ```

    This creates optimized files in the `dist/` directory.

    ### Firebase Hosting

    To deploy to Firebase Hosting:

    1. Install Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```

    2. Login to Firebase:
    ```bash
    firebase login
    ```

    3. Initialize Firebase hosting:
    ```bash
    firebase init hosting
    ```

    4. Deploy to Firebase:
    ```bash
    firebase deploy
    ```

    ---

    ## Security

    ### Authentication Rules

    Authentication is handled by Firebase Authentication, which provides:

    - Secure token-based authentication
    - OAuth integration with Google
    - Session management

    ### Firestore Rules

    Firestore security rules ensure that:

    1. Users can only read public snippets or their own snippets
    2. Users can only write/update/delete their own snippets
    3. Required fields are validated

    Example rules:

    ```
    rules_version = '2';
    service cloud.firestore {
    match /databases/{database}/documents {
        match /snippets/{snippetId} {
        allow read: if resource.data.isPublic == true || 
                    request.auth != null && resource.data.authorId == request.auth.uid;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null && 
                                resource.data.authorId == request.auth.uid;
        }
    }
    }
    ```

    ---

    ## Performance Optimization

    CodeBin implements several performance optimizations:

    1. **Code Splitting**: Routes are loaded lazily
    2. **Asset Optimization**: Images and assets are optimized
    3. **Lazy Loading**: External libraries (like Pyodide) are loaded only when needed
    4. **Caching**: Firestore queries are cached appropriately

    ---

    ## Troubleshooting

    Common issues and solutions:

    1. **Authentication Issues**:
    - Ensure Google Authentication is enabled in Firebase Console
    - Check for correct API keys in environment variables

    2. **Code Execution Problems**:
    - Browser console errors may indicate issues with the runtime
    - Some languages have size or time limitations

    3. **Firebase Connection Issues**:
    - Verify network connectivity
    - Check Firebase project status

    ---

    ## Contributing Guidelines

    To contribute to CodeBin:

    1. Fork the repository
    2. Create a feature branch
    3. Make your changes
    4. Run tests
    5. Submit a pull request

    Please follow the coding style and commit message conventions.

    ---

    ## License

    CodeBin is licensed under the MIT License. 