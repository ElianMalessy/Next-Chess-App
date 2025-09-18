# ♟️ Next Chess App

A modern, real-time multiplayer chess application built with Next.js and Firebase. Play chess with friends online, chat during games, and track your game history.

## 🚀 Features

### 🎮 Core Chess Functionality
- **Full Chess Implementation**: Complete chess rules including castling, en passant, pawn promotion
- **Real-time Multiplayer**: Play against friends with live move synchronization
- **Player Perspectives**: Automatic board orientation (white/black player views)
- **Spectator Mode**: Watch ongoing games as a spectator
- **Move Validation**: Comprehensive legal move checking and game state validation
- **Check/Checkmate Detection**: Automatic game ending detection

### 👥 Social Features
- **Game Invitations**: Send game invites to other users by username
- **Real-time Chat**: Chat with your opponent during games
- **User Profiles**: Customizable avatars and user information
- **Game History**: Track previous games and results
- **User Search**: Find and invite other players

### 🛠️ Additional Features
- **Board Editor**: Create custom board positions for analysis
- **Authentication**: Secure user registration and login
- **Profile Management**: Update username, avatar, and other settings
- **Message System**: In-app messaging and game invitations
- **Game Persistence**: Games are saved and can be resumed

## 🏗️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management

### Backend & Database
- **[Firebase Realtime Database](https://firebase.google.com/products/realtime-database)** - Real-time game state synchronization
- **[Cloud Firestore](https://firebase.google.com/products/firestore)** - User data and game history
- **[Firebase Authentication](https://firebase.google.com/products/auth)** - User authentication
- **[Firebase Storage](https://firebase.google.com/products/storage)** - Profile picture storage

### Development & Tooling
- **[ESLint](https://eslint.org/)** - Code linting
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation
- **[Lucide React](https://lucide.dev/)** - Icon library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Firebase project with Authentication, Firestore, Realtime Database, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ElianMalessy/Next-Chess-App.git
   cd Next-Chess-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Create Realtime Database
   - Enable Storage
   - Get your Firebase config

4. **Configure environment variables**
   Create a `firebase-config.ts` file in the root directory:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getDatabase } from 'firebase/database';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const realtimeDB = getDatabase(app);
   export const storage = getStorage(app);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started
1. **Register/Login**: Create an account or sign in
2. **Update Profile**: Set your username and profile picture
3. **Invite Players**: Search for users and send game invitations
4. **Play Chess**: Enjoy real-time chess games with chat

### Game Features
- **Move Pieces**: Drag and drop pieces to make moves
- **Chat**: Use the chat panel to communicate during games
- **Resign**: End the game early if needed
- **Spectate**: Watch ongoing games without participating

## 🏗️ Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── board-editor/      # Board editor page
│   ├── game/[id]/         # Game page with dynamic routing
│   ├── login/             # Authentication pages
│   ├── messages/          # Message inbox
│   ├── profile/           # User profile management
│   └── ...
├── components/            # Reusable React components
│   ├── board/            # Chess board components
│   ├── game/             # Game-related components
│   ├── navbar/           # Navigation components
│   └── ui/               # UI primitives
├── lib/                  # Utility functions and hooks
│   ├── hooks/            # Custom React hooks
│   └── server-actions/   # Server-side functions
└── public/               # Static assets
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

**Enjoy playing chess! ♟️**
