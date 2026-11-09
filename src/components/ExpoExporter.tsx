import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, Check, Terminal, QrCode, Smartphone, Sparkles, FolderArchive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ExpoExporter: React.FC = () => {
  const { isDark } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();

      // Read or generate the Expo project files
      const packageJson = {
        name: 'wchat-mobile',
        version: '1.0.0',
        main: 'index.js',
        scripts: {
          start: 'expo start',
          android: 'expo start --android',
          ios: 'expo start --ios',
          web: 'expo start --web',
        },
        dependencies: {
          expo: '~52.0.0',
          'expo-status-bar': '~2.0.0',
          react: '18.3.1',
          'react-native': '0.76.7',
          '@react-navigation/native': '^7.0.0',
          '@react-navigation/bottom-tabs': '^7.0.0',
          '@react-navigation/native-stack': '^7.0.0',
          'expo-linear-gradient': '~14.0.0',
          '@expo/vector-icons': '^14.0.0',
          'react-native-safe-area-context': '4.12.0',
          'react-native-screens': '~4.4.0',
          'react-native-svg': '15.8.0',
          '@react-native-async-storage/async-storage': '1.23.1',
        },
        devDependencies: {
          '@babel/core': '^7.25.0',
          '@types/react': '~18.3.12',
          typescript: '^5.3.3',
        },
        private: true,
      };

      const appJson = {
        expo: {
          name: 'Wchat',
          slug: 'wchat',
          version: '1.0.0',
          orientation: 'portrait',
          userInterfaceStyle: 'dark',
          splash: {
            backgroundColor: '#080810',
            resizeMode: 'contain',
          },
          ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.wchat.app',
          },
          android: {
            adaptiveIcon: {
              backgroundColor: '#080810',
            },
            package: 'com.wchat.app',
            permissions: [
              'CAMERA',
              'RECORD_AUDIO',
              'READ_EXTERNAL_STORAGE',
              'WRITE_EXTERNAL_STORAGE',
            ],
          },
        },
      };

      const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`;

      const tsConfig = `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}`;

      const indexJs = `import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);`;

      // Fetch or use App.tsx content
      const appCode = `import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
  Switch,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  dark: { bg: '#080810', surface: '#121221', surface2: '#1B1A2B', border: '#29263D', text: '#F8F6FF', muted: '#9994AD', primary: '#8B3DFF', bright: '#B98AFF', online: '#22C55E' },
  light: { bg: '#F5F4FA', surface: '#FFFFFF', surface2: '#ECEAF5', border: '#D8D4E8', text: '#12111D', muted: '#68647E', primary: '#7E2EE5', bright: '#9B54FF', online: '#16A34A' }
};

const USERS = [
  { id: '1', name: 'Sarah Johnson', matricule: '2025001', phone: '+1 415 555 0192', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', online: true },
  { id: '2', name: 'Ahmed Benali', matricule: '2025002', phone: '+213 550 12 34 56', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', online: true },
  { id: '3', name: 'Emma Wilson', matricule: '2025003', phone: '+44 20 7946 0912', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', online: false },
  { id: '4', name: 'Omar Khaled', matricule: '2025004', phone: '+971 50 123 4567', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', online: true },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('en');
  const [screen, setScreen] = useState('welcome');
  const [tab, setTab] = useState('chats');
  const [activeUser, setActiveUser] = useState(USERS[0]);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey! How are you? 😊', isOutgoing: false, time: '10:15' },
    { id: '2', text: "I'm good! Just working on the project.", isOutgoing: true, time: '10:18' },
    { id: '3', text: 'Same here! We should meet later.', isOutgoing: false, time: '10:20' },
    { id: '4', text: 'Sounds good! ✨', isOutgoing: true, time: '10:22' },
  ]);
  const [input, setInput] = useState('');
  const colors = isDark ? COLORS.dark : COLORS.light;

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: input.trim(), isOutgoing: true, time: 'Just now' }]);
    setInput('');
  };

  if (screen === 'welcome') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <View style={styles.centerHero}>
            <LinearGradient colors={['#8B3DFF', '#C084FC']} style={styles.logoBox}>
              <Text style={styles.logoW}>W</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>Wchat</Text>
            <Text style={{ color: colors.bright, fontSize: 13, fontWeight: '700', letterSpacing: 2 }}>CONNECT · CHAT · SHARE</Text>
            <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8 }}>Real-time conversations, closer than ever.</Text>
          </View>
          <View style={{ padding: 24, gap: 12 }}>
            <TouchableOpacity onPress={() => setScreen('main')} style={styles.btnPrimary}>
              <LinearGradient colors={['#8B3DFF', '#A855F7']} style={styles.gradBtn}>
                <Text style={styles.btnTextWhite}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (screen === 'chat') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <View style={[styles.chatHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setScreen('main')} style={{ padding: 8 }}>
              <Feather name="arrow-left" size={22} color={colors.text} />
            </TouchableOpacity>
            <Image source={{ uri: activeUser.avatar }} style={styles.avatarSm} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.nameText, { color: colors.text }]}>{activeUser.name}</Text>
              <Text style={{ color: colors.online, fontSize: 11, fontWeight: 'bold' }}>Online</Text>
            </View>
          </View>

          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={[styles.msgRow, item.isOutgoing ? styles.msgOut : styles.msgIn]}>
                <View style={[styles.bubble, item.isOutgoing ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface2 }]}>
                  <Text style={{ color: item.isOutgoing ? '#FFF' : colors.text }}>{item.text}</Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4, alignSelf: 'flex-end' }}>{item.time}</Text>
                </View>
              </View>
            )}
          />

          <View style={[styles.inputBar, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.muted}
              style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendCircle}>
              <Feather name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <LinearGradient colors={['#8B3DFF', '#C084FC']} style={styles.logoTiny}>
            <Text style={{ color: '#FFF', fontWeight: '900' }}>W</Text>
          </LinearGradient>
          <Text style={[styles.headerTitle, { color: colors.text }]}>chat</Text>
        </View>

        <FlatList
          data={USERS}
          keyExtractor={u => u.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { setActiveUser(item); setScreen('chat'); }}
              style={[styles.userRow, { borderBottomColor: colors.border }]}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatarMd} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.nameText, { color: colors.text }]}>{item.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>See you soon! 🤝</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerHero: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  logoW: { color: '#FFF', fontSize: 44, fontWeight: '900' },
  title: { fontSize: 32, fontWeight: '900', marginTop: 16 },
  btnPrimary: { borderRadius: 16, overflow: 'hidden' },
  gradBtn: { paddingVertical: 16, alignItems: 'center' },
  btnTextWhite: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  logoTiny: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', marginLeft: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 0.5 },
  avatarMd: { width: 48, height: 48, borderRadius: 24 },
  avatarSm: { width: 40, height: 40, borderRadius: 20 },
  nameText: { fontSize: 15, fontWeight: '700' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  msgRow: { marginVertical: 4 },
  msgOut: { alignItems: 'flex-end' },
  msgIn: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1 },
  inputBox: { flex: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, marginRight: 8 },
  sendCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B3DFF', alignItems: 'center', justifyContent: 'center' },
});`;

      const readmeMd = `# Wchat - Expo & React Native Mobile App

Run directly with Expo Go on your Android phone:

\`\`\`bash
npm install
npx expo start
\`\`\`

Scan the generated QR code in your terminal using the **Expo Go** Android app!
`;

      // Build zip structure
      zip.file('package.json', JSON.stringify(packageJson, null, 2));
      zip.file('app.json', JSON.stringify(appJson, null, 2));
      zip.file('babel.config.js', babelConfig);
      zip.file('tsconfig.json', tsConfig);
      zip.file('index.js', indexJs);
      zip.file('App.tsx', appCode);
      zip.file('README.md', readmeMd);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wchat-expo-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Android Testing with Expo Go</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-600 text-white font-semibold">
                SDK 52
              </span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Run <code className="text-purple-300 bg-black/40 px-1 py-0.5 rounded">npx expo start</code> directly or download the complete project ZIP.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,61,255,0.4)] active:scale-95 transition-all shrink-0"
        >
          {exported ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating ZIP...' : 'Download Expo ZIP'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
