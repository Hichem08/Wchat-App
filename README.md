# Wchat - Real-Time Mobile Messaging Application

> "Real-time conversations, closer than ever."

Wchat is a mobile messaging application designed with a dark purple neon identity, multi-language support (**English**, **Français**, and **العربية with full RTL layout**), interactive voice notes, simulated voice/video calls, and a 24-hour message auto-deletion architecture.

---

## 🎨 Visual Identity & Reference Design
- **Background**: Deep Dark `#080810`
- **Primary Surfaces**: `#121221` and `#1B1A2B`
- **Neon Accents**: Vibrant Purple `#8B3DFF` & Bright Violet `#B98AFF`
- **Typography**: Plus Jakarta Sans & Tajawal (Arabic)
- **Status & Badges**: Glowing neon dots, audio waveforms, rounded pill controls

---

## 📱 Project Structure

```
├── app.json                  # Expo mobile application configuration
├── babel.config.js           # Babel resolver configuration
├── package.json              # Dependencies and scripts
├── src/
│   ├── components/
│   │   ├── WchatLogo.tsx     # Stylized glowing purple W logo
│   │   ├── Avatar.tsx        # Avatar with online badge & glowing ring
│   │   ├── ChatItem.tsx      # Conversation list row with unread badges
│   │   ├── MessageBubble.tsx # Outgoing/incoming bubbles, voice waveform & 24h tag
│   │   ├── SearchBar.tsx     # Rounded search input with RTL support
│   │   ├── BottomNav.tsx     # Chats, Contacts, Discover, Profile navigation
│   │   ├── AttachmentSheet.tsx # 6 file attachment options (Photo, Camera, PDF, Doc, Audio, GPS)
│   │   ├── CallModal.tsx     # Immersive voice & video call overlay
│   │   └── DeviceFrame.tsx   # Mobile phone simulator with status bar & controls
│   ├── screens/
│   │   ├── WelcomeScreen.tsx # Splash / welcome with neon W logo & language selector
│   │   ├── LoginScreen.tsx   # Login with Google & Supabase social buttons
│   │   ├── SignupScreen.tsx  # Registration with name, email, phone, matricule, password
│   │   ├── LanguageScreen.tsx # Choose your language (English, Français, العربية)
│   │   ├── HomeScreen.tsx    # Chats, Groups, Calls tabs & search
│   │   ├── ChatConversationScreen.tsx # Active chat, voice notes, attachments, call buttons
│   │   ├── NewMessageScreen.tsx # Search by name, matricule (2025001), or phone
│   │   ├── CreateGroupScreen.tsx # Create group with photo, name, description, and members
│   │   ├── ContactsScreen.tsx # All contacts, online friends filter, direct message & call
│   │   ├── DiscoverScreen.tsx # People you may know, suggested groups, active users
│   │   ├── ProfileScreen.tsx # Profile details, matricule, edit mode, language, logout
│   │   └── SettingsScreen.tsx # Language selector, notifications, 24h auto-delete, dark mode
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Dynamic screen transitions & modal management
│   ├── context/
│   │   ├── ThemeContext.tsx  # Centralized dark/light mode provider
│   │   ├── LanguageContext.tsx # i18n & RTL provider
│   │   ├── AuthContext.tsx   # User profile, login, registration, logout
│   │   └── ChatContext.tsx   # Chats, messaging, voice notes, group creation, simulated calls
│   ├── services/
│   │   ├── authService.ts    # Future Supabase Auth integration interface
│   │   ├── chatService.ts    # Future Socket.IO room & typing integration interface
│   │   ├── userService.ts    # Future Supabase Profiles & contacts sync interface
│   │   ├── messageService.ts # Future Socket.IO messaging & Supabase storage interface
│   │   └── callService.ts    # Future WebRTC audio/video calling interface
│   ├── constants/
│   │   └── mockData.ts       # Realistic mock data (Sarah, Ahmed, Emma, Omar, Hichem)
│   ├── i18n/
│   │   └── translations.ts   # English, French, Arabic RTL dictionaries
│   ├── theme/
│   │   ├── colors.ts         # Color palette definitions
│   │   └── theme.ts          # Centralized theme hook
│   └── types/
│       └── index.ts          # Full TypeScript models
```

---

## 🚀 How to Run on Android with Expo Go

1. **Install Expo Go** on your Android smartphone from the Google Play Store.
2. In the project root, install packages and start Expo:
   ```bash
   npm install
   npx expo start
   ```
3. A QR code will display in the terminal.
4. Open the **Expo Go** app on your phone and tap **Scan QR code**.
5. Wchat will open natively on your device.

---

## 🧪 Testing All Interactive Features

1. **Welcome & Authentication**:
   - Tap **Get Started** to open Sign Up (supports full name, email, phone, matricule, password).
   - Tap **Log In** to open Log In (includes simulated Google & Supabase buttons).
   - Submitting signs you in and opens the home chat list.
2. **Messaging & Voice Notes**:
   - Tap any conversation (e.g. **Sarah Johnson**).
   - Type a message and tap the purple Send button. Notice how Sarah automatically sends a friendly reply after 1.5s!
   - Tap the **Microphone** icon to record and send an interactive voice note bubble with waveform. Tap the play button on any voice note to see animated playback.
   - Tap the **Attachment** (paperclip) icon to open the 6-item Send File grid (Photo, Camera, Document, PDF, Audio, Location). Selecting any option sends the attachment.
3. **Simulated Voice & Video Calls**:
   - Inside any conversation or from the Contacts / Calls tab, tap the **Phone** or **Video** icon.
   - The full-screen call screen opens with timer, pulsating audio rings, Mute toggle, Speaker toggle, Video camera switch, and red End Call button.
4. **Multi-Language & Arabic RTL**:
   - Switch language at any time from the top bar, Profile, or Settings (select **العربية**).
   - The entire layout immediately inverts to Right-To-Left (RTL), text aligns to the right, and Arabic copy is displayed.
5. **Dark Mode & Light Mode**:
   - Go to Settings or click the Sun/Moon toggle in the top bar to switch between Dark `#080810` and Light themes dynamically.
6. **Group Creation**:
   - Go to Home > Groups tab > tap **Create Group** (or "+").
   - Enter group name, description, select/deselect members, and tap Create. The group will appear in your conversations.
7. **Find Friends & Matricule Search**:
   - Tap the edit icon on the home screen to open **New Message**.
   - Search by name or type `2025` to filter by student matricule.
