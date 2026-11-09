# Wchat - Real-Time Mobile Messaging Application (Phase 2 Full-Stack)

> "Real-time conversations, closer than ever."

Wchat is a modern real-time mobile messaging application with a signature glowing purple visual identity, complete internationalization (**English**, **Français**, and **العربية with full RTL layout**), real-time WebSocket messaging, 24-hour disappearing messages, and Supabase integration.

---

## 🏗️ Architecture Overview

The Wchat ecosystem consists of 3 integrated layers:

```
wchat/
├── supabase/migrations/      # Supabase PostgreSQL schema, RLS policies, triggers & buckets
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   ├── 003_functions.sql
│   └── 004_storage.sql
├── server/                   # Node.js + Express + Socket.IO Backend Server
│   ├── src/
│   │   ├── config/supabase.ts        # Supabase Service Role client
│   │   ├── middleware/auth.ts        # Supabase JWT validator for REST & Sockets
│   │   ├── jobs/messageCleanupJob.ts # 24h message auto-deletion cron runner
│   │   ├── socket/socketHandler.ts   # Real-time rooms, typing, presence & WebRTC signaling
│   │   ├── routes/                   # REST endpoints (/health, /api/chats, /friends, etc.)
│   │   └── server.ts                 # HTTP + WebSocket listener
│   ├── .env.example
│   └── package.json
├── expo-wchat/               # Standalone React Native / Expo Mobile App
│   ├── App.tsx
│   ├── app.json
│   └── package.json
└── src/                      # AI Studio Web Preview with Mobile Frame & QR Export
    ├── context/              # ChatContext, AuthContext, ThemeContext, LanguageContext
    ├── services/             # Supabase & Socket.IO client services
    ├── screens/              # All 11 pixel-perfect screens matching the reference design
    └── components/           # Reusable UI widgets with glowing neon styling
```

---

## 🗄️ Supabase Database Setup

Run the migrations in your Supabase project in numerical order under **SQL Editor**:

1. `001_initial_schema.sql`:
   - `profiles`: id, full_name, email, phone, matricule, avatar_url, is_online, last_seen.
   - `friendships`: user_id, friend_id, status ('pending', 'accepted', 'blocked').
   - `chats`: id, type ('direct', 'group'), name, description, avatar_url.
   - `chat_members`: chat_id, user_id, role.
   - `messages`: id, chat_id, sender_id, type ('text', 'voice', 'image', 'file', 'location'), content, media_url, expires_at (default `now() + interval '24 hours'`).
   - `message_reads`: message_id, user_id, read_at.
   - `notifications`: user_id, title, body, type, is_read.
   - `calls`: caller_id, receiver_id, chat_id, type, status, duration.

2. `002_rls_policies.sql`:
   - Row Level Security enabled across all tables.
   - Users can only read messages in chats where they are verified members.
   - Profile self-update policies.

3. `003_functions.sql`:
   - `handle_new_user()` trigger auto-creates profile on `auth.users` sign-up.
   - `cleanup_expired_messages()` function that deletes records where `expires_at < now()`.
   - `get_or_create_private_chat()` function for 1-on-1 conversations.

4. `004_storage.sql`:
   - Configures storage buckets: `avatars`, `chat-files`, `chat-images`, `chat-audio`.
   - Storage RLS access policies.

---

## 🚀 Running the Node.js / Socket.IO Server

1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```

2. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```env
   PORT=4000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   CLIENT_URL=http://localhost:3000
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

The server listens on port `4000` (or `PORT`), serving:
- `GET /health`: Health check and timestamp.
- Socket.IO connection at `/socket.io/`.
- 24-hour cleanup cron runner active every 10 minutes.

---

## 📱 Running on Android with Expo Go

1. In `expo-wchat/`:
   ```bash
   cd expo-wchat
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Set your computer's local Wi-Fi IP address so your Android phone can reach the backend:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EXPO_PUBLIC_SOCKET_SERVER_URL=http://192.168.1.XX:4000
   ```

3. Start Expo:
   ```bash
   npx expo start --clear
   ```

4. Scan the QR code using the **Expo Go** app on your Android smartphone.

---

## ⏳ 24-Hour Message Auto-Delete Workflow

1. When any message is inserted into Supabase, the default column constraint sets:
   `expires_at = now() + interval '24 hours'`
2. When querying messages in `messageService.ts`, only active messages are fetched:
   `.gt('expires_at', new Date().toISOString())`
3. The Node.js server background job (`messageCleanupJob.ts`) runs every 10 minutes, calling `supabase.rpc('cleanup_expired_messages')` or issuing a direct delete to prune expired rows and keep storage lightweight.
4. The client UI renders a subtle ⏳ indicator reflecting the 24-hour ephemeral lifecycle.

---

## 📞 WebRTC Audio & Video Calling

- `socketHandler.ts` handles WebRTC signaling events:
  - `call_offer`: Transmits SDP offer with caller ID, media type, and caller name.
  - `call_answer`: Transmits SDP answer back to caller.
  - `ice_candidate`: Exchanges network candidate pairs.
  - `call_end` / `call_reject`: Cleans up active call session.
- Client implementation:
  - Inside the browser and Expo preview, an interactive simulation with live timer, active waveforms, mute/speaker toggles, and camera view is fully functional.
  - In a bare React Native production binary, `react-native-webrtc` is used via Expo Development Builds (`npx expo run:android`) as standard Expo Go does not package native C++ WebRTC binaries.
