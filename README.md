# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# StudyAir

StudyAir is a React.js web app featuring AI-powered study tools including Note Taker, Quiz Generator, and Study Room.  

## Features
Frontend:

- Home page with hero section and floating messages
- Navigation bar with Home, About, AI Agents dropdown, Account Management, and Setting Display Themes
- Individual pages for each AI Agent
- Responsive design with hover animations
- Interactive settings page allowing user to easily change thier account details

Backend:

- User Authentication: Secure Sign up, Login, and password reset functionality using firebase
- Ensures username uniqueness by linking firebase usernames and users collections
- Provides real time user tracking using Firebase's AuthStateChanged.
- The backend incorporates Firebase Authentication (manages accounts), Cloud Firestore (NoSQL databse used to store user profiles and details), and Firebase Storage (used for retriving user profile icons, as of right now it's tied to a simple API that generates initials from names: https://ui-avatars.com/) for its full integraition. 

## Dependencies

These packages are required for the frontend:

- **react** – Core library for building UI  
- **react-dom** – Rendering React components in the DOM  
- **react-router-dom** – Routing between pages/components

These packages are required for the Backend:

- **firebase** – Integration for Auth, Firestore, and Storage  
- **concurrently** – Runs the client and server development processes simultaneously  
- **vite** – Build tool and development server

# 📦 Dependencies

Below are the key backend dependencies and their purposes.

---

## **Core Framework**

| Package | Purpose |
|--------|---------|
| **express** | Web framework used to create REST API endpoints. |
| **cors** | Enables the frontend (local or deployed) to access the backend. |

---

## **AI & Transcription**

| Package | Purpose |
|--------|---------|
| **groq-sdk** | Connects to Groq’s AI API for generating quizzes or transcription. If using OpenAI Whisper instead of Groq, replace with the appropriate SDK. |

---

## **Firebase / Database**

| Package | Purpose |
|--------|---------|
| **firebase-admin** | Secure server-side access to Firestore & Storage. Used to save notes, quiz results, and more. |

---

## **Uploads / File Handling**

| Package | Purpose |
|--------|---------|
| **multer** | Handles file uploads (e.g., audio files) from the frontend. |
| **fs** | Node’s built-in file system module used to read/write uploaded files. |
| **path** | Built-in module for safely manipulating file paths. |

---

## **Environment & Server Tools**

| Package | Purpose |
|--------|---------|
| **dotenv** | Loads API keys and secrets from `.env` without exposing them in code. |

---

🚀 Backend Deployment (Render)

Follow these steps to deploy the StudyAir backend using Render Web Services.

Step 1: Create a New Web Service

Go to Render → New → Web Service

Connect your GitHub repository containing the backend code.

Choose the following options:

Environment: Node

Build Command:

npm install


Start Command:

node server.js


Render will automatically detect your package.json.

Step 2: Add Environment Variables

Go to:

Render → Your Service → Environment → Add Environment Variable

Add:

PORT=3000
GROQ_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key_here"


If you use serviceAccountKey.json, upload it in Render’s Disk section.

Step 3: Deploy

Push to GitHub → Render auto-deploys.

Your backend will be available at:

https://your-service-name.onrender.com

⚙️ Installation & Local Setup
1. Clone the Repository
git clone https://github.com/yourusername/studyair-backend.git
cd studyair-backend

2. Install Backend Dependencies
npm install

3. Configure Firebase

Create your Firebase service account and ensure your backend initialization file references:

projectId

clientEmail

privateKey

Or place your serviceAccountKey.json in the root folder.

4. Install Firebase SDK (Frontend Only)

If your frontend uses Firebase:

npm install firebase

5. Install Concurrently (Optional)

This allows you to run frontend + backend together:

npm install concurrently vite --save-dev


Then in your package.json:

"scripts": {
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
}

6. Start the Development Server
npm run dev

Go to:
Render → Your Service → Environment → Add Environment Variable
Add the following:

```bash
npm install

# ⚙️ Installation & Setup

### **1. Clone the repository**

```bash
git clone https://github.com/yourusername/studyair-backend.git
cd studyair-backend

You can install them with:

```bash
npm install

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/studyair.git

2. In the terminal "cd studyair"
3. Configure Firebase, make sure your firebase.js is configured with your specific APIKey and projectID
3. To download firebase, you can run this command to install the latest SDK: 
    npm install firebase
4. To download concurrently, you can run this command to install it, this allows you to run your frontend and backend server at the same time with one command:
    npm install concurrently vite --save-dev
6. In the terminal, Start development server with "npm run dev"


Study website with AI integration for the future of studying
Contributors: Sommie, Greg, Macy, Glorie, Ivory
