import React, { useState, useEffect, useRef } from 'react';
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
  I18nManager,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// Theme definitions
const COLORS = {
  dark: {
    bg: '#080810',
    surface: '#121221',
    surface2: '#1B1A2B',
    border: '#29263D',
    text: '#F8F6FF',
    muted: '#9994AD',
    primary: '#8B3DFF',
    brightPurple: '#B98AFF',
    online: '#22C55E',
    danger: '#EF4444',
  },
  light: {
    bg: '#F5F4FA',
    surface: '#FFFFFF',
    surface2: '#ECEAF5',
    border: '#D8D4E8',
    text: '#12111D',
    muted: '#68647E',
    primary: '#7E2EE5',
    brightPurple: '#9B54FF',
    online: '#16A34A',
    danger: '#DC2626',
  },
};

// Translations
const I18N = {
  en: {
    appName: 'Wchat',
    tagline: 'Real-time conversations, closer than ever.',
    getStarted: 'Get Started',
    logIn: 'Log In',
    signUp: 'Sign Up',
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    joinWchat: 'Join Wchat and start messaging with your friends.',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone number',
    matricule: 'Matricule (optional)',
    password: 'Password',
    chats: 'Chats',
    groups: 'Groups',
    calls: 'Calls',
    contacts: 'Contacts',
    discover: 'Discover',
    profile: 'Profile',
    settings: 'Settings',
    search: 'Search...',
    typing: 'typing...',
    online: 'Online',
    offline: 'Offline',
    typeMessage: 'Type a message...',
    disappearingNotice: 'Messages disappear after 24 hours.',
    voiceCall: 'Voice Call',
    videoCall: 'Video Call',
    endCall: 'End Call',
    sendFile: 'Send File',
    photo: 'Photo',
    camera: 'Camera',
    document: 'Document',
    pdf: 'PDF',
    audio: 'Audio',
    location: 'Location',
    createGroup: 'Create Group',
    groupName: 'Group Name',
    addMembers: 'Add Members',
    create: 'Create',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    autoDelete: 'Auto delete messages',
    twentyFourHours: '24 Hours',
    logOut: 'Log Out',
    recent: 'Recent',
    searchFriends: 'Search by name, matricule or phone...',
  },
  fr: {
    appName: 'Wchat',
    tagline: 'Des conversations en temps réel, plus proches que jamais.',
    getStarted: 'Commencer',
    logIn: 'Se connecter',
    signUp: "S'inscrire",
    welcomeBack: 'Bon retour',
    createAccount: 'Créez votre compte',
    joinWchat: 'Rejoignez Wchat et commencez à discuter avec vos amis.',
    fullName: 'Nom complet',
    email: 'E-mail',
    phone: 'Numéro de téléphone',
    matricule: 'Matricule (optionnel)',
    password: 'Mot de passe',
    chats: 'Discussions',
    groups: 'Groupes',
    calls: 'Appels',
    contacts: 'Contacts',
    discover: 'Découvrir',
    profile: 'Profil',
    settings: 'Paramètres',
    search: 'Rechercher...',
    typing: 'écrit...',
    online: 'En ligne',
    offline: 'Hors ligne',
    typeMessage: 'Écrivez un message...',
    disappearingNotice: 'Les messages disparaissent après 24 heures.',
    voiceCall: 'Appel vocal',
    videoCall: 'Appel vidéo',
    endCall: 'Raccrocher',
    sendFile: 'Envoyer un fichier',
    photo: 'Photo',
    camera: 'Appareil photo',
    document: 'Document',
    pdf: 'PDF',
    audio: 'Audio',
    location: 'Localisation',
    createGroup: 'Créer un groupe',
    groupName: 'Nom du groupe',
    addMembers: 'Ajouter des membres',
    create: 'Créer',
    darkMode: 'Mode sombre',
    notifications: 'Notifications',
    autoDelete: 'Suppression auto',
    twentyFourHours: '24 Heures',
    logOut: 'Déconnexion',
    recent: 'Récents',
    searchFriends: 'Rechercher par nom, matricule ou tél...',
  },
  ar: {
    appName: 'Wchat',
    tagline: 'محادثات فورية، أقرب إليك من أي وقت مضى.',
    getStarted: 'ابدأ الآن',
    logIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب جديد',
    welcomeBack: 'مرحباً بعودتك',
    createAccount: 'إنشاء حسابك',
    joinWchat: 'انضم إلى Wchat وابدأ المحادثة مع أصدقائك.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    matricule: 'رقم القيد / ماتريكول',
    password: 'كلمة المرور',
    chats: 'المحادثات',
    groups: 'المجموعات',
    calls: 'المكالمات',
    contacts: 'جهات الاتصال',
    discover: 'استكشف',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    search: 'بحث...',
    typing: 'يكتب الآن...',
    online: 'متصل الآن',
    offline: 'غير متصل',
    typeMessage: 'اكتب رسالة...',
    disappearingNotice: 'تختفي الرسائل تلقائياً بعد 24 ساعة.',
    voiceCall: 'مكالمة صوتية',
    videoCall: 'مكالمة فيديو',
    endCall: 'إنهاء المكالمة',
    sendFile: 'إرسال ملف',
    photo: 'صورة',
    camera: 'الكاميرا',
    document: 'مستند',
    pdf: 'ملف PDF',
    audio: 'صوت',
    location: 'الموقع',
    createGroup: 'إنشاء مجموعة',
    groupName: 'اسم المجموعة',
    addMembers: 'إضافة أعضاء',
    create: 'إنشاء',
    darkMode: 'الوضع الداكن',
    notifications: 'الإشعارات',
    autoDelete: 'الحذف التلقائي',
    twentyFourHours: '24 ساعة',
    logOut: 'تسجيل الخروج',
    recent: 'الأحدث',
    searchFriends: 'البحث بالاسم أو رقم القيد أو الهاتف...',
  },
};

// Mock Users
const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Sarah Johnson',
    matricule: '2025001',
    phone: '+1 415 555 0192',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    online: true,
  },
  {
    id: 'u2',
    name: 'Ahmed Benali',
    matricule: '2025002',
    phone: '+213 550 12 34 56',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    online: true,
  },
  {
    id: 'u3',
    name: 'Emma Wilson',
    matricule: '2025003',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    online: false,
  },
  {
    id: 'u4',
    name: 'Omar Khaled',
    matricule: '2025004',
    phone: '+971 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    online: true,
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<'en' | 'fr' | 'ar'>('en');
  const [screen, setScreen] = useState<'welcome' | 'signup' | 'login' | 'main' | 'chat'>('welcome');
  const [mainTab, setMainTab] = useState<'chats' | 'contacts' | 'discover' | 'profile'>('chats');
  const [chatSubTab, setChatSubTab] = useState<'chats' | 'groups' | 'calls'>('chats');
  
  // Active conversation
  const [activeUser, setActiveUser] = useState(INITIAL_USERS[0]);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isOutgoing: boolean; time: string; type?: string }>>([
    { id: '1', text: 'Hey! How are you? 😊', isOutgoing: false, time: '10:15' },
    { id: '2', text: "I'm good! Just working on the project. What about you?", isOutgoing: true, time: '10:18' },
    { id: '3', text: 'Same here! We should meet later.', isOutgoing: false, time: '10:20' },
    { id: '4', text: 'Sounds good! ✨', isOutgoing: true, time: '10:22' },
    { id: '5', text: '🎤 Voice message (0:12)', isOutgoing: false, time: '10:24', type: 'voice' },
  ]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callTimer, setCallTimer] = useState(24);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  const colors = isDark ? COLORS.dark : COLORS.light;
  const t = (key: keyof typeof I18N.en) => I18N[lang][key] || I18N.en[key] || key;
  const isRTL = lang === 'ar';

  // Live call timer
  useEffect(() => {
    let interval: any;
    if (isCallOpen) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCallOpen]);

  // Send message
  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isOutgoing: true,
      time: 'Just now',
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Auto reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Got your message! Looks amazing on Android 💜",
          isOutgoing: false,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  const openCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setIsCallOpen(true);
  };

  // 1. WELCOME SCREEN
  if (screen === 'welcome') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          
          {/* Language Selector Top Right */}
          <View style={[styles.topRow, { justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              onPress={() => setLang(lang === 'en' ? 'fr' : lang === 'fr' ? 'ar' : 'en')}
              style={[styles.langPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Feather name="globe" size={14} color={colors.brightPurple} />
              <Text style={[styles.langText, { color: colors.text }]}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          {/* Center Brand */}
          <View style={styles.centerHero}>
            {/* Wchat Stylized Logo */}
            <LinearGradient
              colors={['#8B3DFF', '#C084FC', '#6366F1']}
              style={styles.logoCircle}
            >
              <Text style={styles.logoW}>W</Text>
            </LinearGradient>

            <Text style={[styles.logoTitle, { color: colors.text }]}>
              W<Text style={{ fontWeight: '400' }}>chat</Text>
            </Text>
            <Text style={[styles.slogan, { color: colors.brightPurple }]}>Connect · Chat · Share</Text>
            <Text style={[styles.tagline, { color: colors.muted }]}>{t('tagline')}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.welcomeActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setScreen('signup')}
              style={styles.primaryBtn}
            >
              <LinearGradient
                colors={['#8B3DFF', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.btnTextWhite}>{t('getStarted')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setScreen('login')}
              style={[styles.outlineBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>{t('logIn')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 2. SIGNUP / LOGIN SCREENS
  if (screen === 'signup' || screen === 'login') {
    const isSignup = screen === 'signup';
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <TouchableOpacity onPress={() => setScreen('welcome')} style={styles.backBtn}>
            <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={24} color={colors.text} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.authLogo}>
              <LinearGradient colors={['#8B3DFF', '#A855F7']} style={styles.smallLogo}>
                <Text style={styles.smallLogoW}>W</Text>
              </LinearGradient>
              <Text style={[styles.authTitle, { color: colors.text }]}>
                {isSignup ? t('createAccount') : t('welcomeBack')}
              </Text>
              <Text style={[styles.authSub, { color: colors.muted }]}>
                {isSignup ? t('joinWchat') : 'Sign in to your account'}
              </Text>
            </View>

            <View style={styles.formContainer}>
              {isSignup && (
                <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Feather name="user" size={18} color={colors.muted} />
                  <TextInput
                    placeholder={t('fullName')}
                    placeholderTextColor={colors.muted}
                    style={[styles.textInput, { color: colors.text }]}
                    defaultValue="Hichem Bendali"
                  />
                </View>
              )}

              <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Feather name="mail" size={18} color={colors.muted} />
                <TextInput
                  placeholder={t('email')}
                  placeholderTextColor={colors.muted}
                  style={[styles.textInput, { color: colors.text }]}
                  defaultValue="hichembendali08@gmail.com"
                />
              </View>

              {isSignup && (
                <>
                  <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Feather name="phone" size={18} color={colors.muted} />
                    <TextInput
                      placeholder={t('phone')}
                      placeholderTextColor={colors.muted}
                      style={[styles.textInput, { color: colors.text }]}
                      defaultValue="+33 6 12 34 56 78"
                    />
                  </View>
                  <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Feather name="hash" size={18} color={colors.muted} />
                    <TextInput
                      placeholder={t('matricule')}
                      placeholderTextColor={colors.muted}
                      style={[styles.textInput, { color: colors.text }]}
                      defaultValue="2025005"
                    />
                  </View>
                </>
              )}

              <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Feather name="lock" size={18} color={colors.muted} />
                <TextInput
                  placeholder={t('password')}
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  style={[styles.textInput, { color: colors.text }]}
                  defaultValue="secret123"
                />
              </View>

              <TouchableOpacity
                onPress={() => setScreen('main')}
                activeOpacity={0.85}
                style={[styles.primaryBtn, { marginTop: 16 }]}
              >
                <LinearGradient colors={['#8B3DFF', '#A855F7']} style={styles.gradientBtn}>
                  <Text style={styles.btnTextWhite}>{isSignup ? t('signUp') : t('logIn')}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setScreen(isSignup ? 'login' : 'signup')}
                style={{ marginTop: 16, alignItems: 'center' }}
              >
                <Text style={{ color: colors.muted, fontSize: 13 }}>
                  {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 3. CONVERSATION SCREEN
  if (screen === 'chat') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          
          {/* Chat Header */}
          <View style={[styles.chatHeader, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setScreen('main')} style={styles.p8}>
              <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={22} color={colors.text} />
            </TouchableOpacity>

            <Image source={{ uri: activeUser.avatar }} style={styles.chatAvatar} />

            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Text style={[styles.chatName, { color: colors.text }]}>{activeUser.name}</Text>
              <Text style={{ fontSize: 11, color: colors.online, fontWeight: '600' }}>{t('online')}</Text>
            </View>

            <TouchableOpacity onPress={() => openCall('voice')} style={styles.p8}>
              <Feather name="phone" size={19} color={colors.brightPurple} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openCall('video')} style={styles.p8}>
              <Feather name="video" size={19} color={colors.brightPurple} />
            </TouchableOpacity>
          </View>

          {/* 24-Hour Notice Banner */}
          <View style={styles.autoDeleteBanner}>
            <Feather name="clock" size={13} color="#C084FC" />
            <Text style={styles.autoDeleteText}>{t('disappearingNotice')}</Text>
          </View>

          {/* Message List */}
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => {
              const isOut = item.isOutgoing;
              return (
                <View style={[styles.msgRow, isOut ? styles.msgOut : styles.msgIn]}>
                  {isOut ? (
                    <LinearGradient
                      colors={['#8B3DFF', '#A855F7']}
                      style={[styles.msgBubble, styles.msgBubbleOut]}
                    >
                      <Text style={styles.msgTextOut}>{item.text}</Text>
                      <Text style={styles.msgTimeOut}>{item.time} ✓✓</Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.msgBubble, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                      <Text style={[styles.msgTextIn, { color: colors.text }]}>{item.text}</Text>
                      <Text style={[styles.msgTimeIn, { color: colors.muted }]}>{item.time}</Text>
                    </View>
                  )}
                </View>
              );
            }}
          />

          {/* Bottom Message Input Bar */}
          <View style={[styles.chatInputBar, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={() => setIsAttachmentOpen(true)} style={styles.p8}>
              <Feather name="paperclip" size={20} color={colors.muted} />
            </TouchableOpacity>

            <View style={[styles.inputFieldBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={t('typeMessage')}
                placeholderTextColor={colors.muted}
                style={[styles.chatInput, { color: colors.text }]}
              />
            </View>

            {inputText.trim().length > 0 ? (
              <TouchableOpacity onPress={handleSend} style={styles.sendBtnCircle}>
                <Feather name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setMessages(prev => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      text: '🎤 Voice message (0:09)',
                      isOutgoing: true,
                      time: 'Just now',
                      type: 'voice',
                    },
                  ]);
                }}
                style={styles.sendBtnCircle}
              >
                <Feather name="mic" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Send File Bottom Sheet Modal */}
          <Modal visible={isAttachmentOpen} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={[styles.sheetContent, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <View style={styles.sheetHeader}>
                  <Text style={[styles.sheetTitle, { color: colors.text }]}>{t('sendFile')}</Text>
                  <TouchableOpacity onPress={() => setIsAttachmentOpen(false)}>
                    <Feather name="x" size={20} color={colors.muted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.sheetGrid}>
                  {[
                    { id: 'photo', name: t('photo'), icon: 'image', color: '#A855F7' },
                    { id: 'camera', name: t('camera'), icon: 'camera', color: '#8B5CF6' },
                    { id: 'doc', name: t('document'), icon: 'file-text', color: '#3B82F6' },
                    { id: 'pdf', name: t('pdf'), icon: 'file', color: '#F43F5E' },
                    { id: 'audio', name: t('audio'), icon: 'music', color: '#EC4899' },
                    { id: 'loc', name: t('location'), icon: 'map-pin', color: '#10B981' },
                  ].map(opt => (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => {
                        setIsAttachmentOpen(false);
                        setMessages(prev => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            text: `📎 Attached: ${opt.name}`,
                            isOutgoing: true,
                            time: 'Just now',
                          },
                        ]);
                      }}
                      style={[styles.sheetItem, { backgroundColor: colors.surface2 }]}
                    >
                      <View style={[styles.optIconBox, { backgroundColor: opt.color + '25' }]}>
                        <Feather name={opt.icon as any} size={24} color={opt.color} />
                      </View>
                      <Text style={[styles.optLabel, { color: colors.text }]}>{opt.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          {/* Call Modal (Voice / Video) */}
          <Modal visible={isCallOpen} animationType="fade">
            <View style={styles.callContainer}>
              <View style={styles.callTop}>
                <TouchableOpacity onPress={() => setIsCallOpen(false)} style={styles.callMinBtn}>
                  <Feather name="minimize-2" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.callTypeTitle}>{callType === 'video' ? t('videoCall') : t('voiceCall')}</Text>
                <View style={{ width: 40 }} />
              </View>

              <View style={styles.callCenter}>
                <LinearGradient colors={['#8B3DFF55', '#8B3DFF11']} style={styles.pulseRing}>
                  <Image source={{ uri: activeUser.avatar }} style={styles.callAvatar} />
                </LinearGradient>
                <Text style={styles.callName}>{activeUser.name}</Text>
                <Text style={styles.callDuration}>
                  00:{callTimer < 10 ? '0' : ''}{callTimer}
                </Text>
              </View>

              <View style={styles.callControlsRow}>
                <TouchableOpacity style={styles.callCtrlBtn}>
                  <Feather name="mic" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.callCtrlBtn}>
                  <Feather name="volume-2" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCallType(callType === 'voice' ? 'video' : 'voice')}
                  style={styles.callCtrlBtn}
                >
                  <Feather name={callType === 'video' ? 'video' : 'video-off'} size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsCallOpen(false)} style={styles.endCallBtn}>
                  <MaterialCommunityIcons name="phone-hangup" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 4. MAIN SCREEN (TABS: Chats, Contacts, Discover, Profile)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Top Header */}
        <View style={[styles.mainHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.logoRow}>
            <LinearGradient colors={['#8B3DFF', '#C084FC']} style={styles.headerLogoBox}>
              <Text style={styles.headerLogoW}>W</Text>
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: colors.text }]}>chat</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setIsNewMessageOpen(true)} style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="edit" size={17} color={colors.brightPurple} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content based on mainTab */}
        {mainTab === 'chats' && (
          <View style={{ flex: 1 }}>
            {/* Search Bar */}
            <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="search" size={16} color={colors.muted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('search')}
                placeholderTextColor={colors.muted}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>

            {/* Sub Tabs: Chats, Groups, Calls */}
            <View style={styles.subTabRow}>
              {(['chats', 'groups', 'calls'] as const).map(tab => {
                const isActive = chatSubTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setChatSubTab(tab)}
                    style={[
                      styles.subTabPill,
                      isActive
                        ? styles.subTabActive
                        : { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subTabText,
                        { color: isActive ? '#FFFFFF' : colors.muted },
                      ]}
                    >
                      {t(tab)}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {chatSubTab === 'groups' && (
                <TouchableOpacity
                  onPress={() => setIsCreateGroupOpen(true)}
                  style={styles.newGroupBtn}
                >
                  <Feather name="plus" size={14} color="#C084FC" />
                  <Text style={{ fontSize: 12, color: '#C084FC', fontWeight: 'bold' }}>{t('createGroup')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Conversation List */}
            <FlatList
              data={INITIAL_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setActiveUser(item);
                    setScreen('chat');
                  }}
                  activeOpacity={0.7}
                  style={[styles.chatRow, { borderBottomColor: colors.border }]}
                >
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
                    {item.online && <View style={styles.onlineDot} />}
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.rowName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.rowTime, { color: colors.muted }]}>10:24</Text>
                    </View>
                    <Text style={[styles.lastMsg, { color: colors.muted }]} numberOfLines={1}>
                      See you soon! 🤝
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Profile / Settings Tab */}
        {mainTab === 'profile' && (
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <LinearGradient colors={['#8B3DFF', '#C084FC']} style={styles.profileAvatarBorder}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }}
                  style={styles.profileAvatar}
                />
              </LinearGradient>
              <Text style={[styles.profileName, { color: colors.text }]}>Hichem Bendali</Text>
              <Text style={{ fontSize: 13, color: colors.muted }}>Matricule: 2025005</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.greenPulse} />
                <Text style={{ color: colors.online, fontSize: 12, fontWeight: '700' }}>{t('online')}</Text>
              </View>
            </View>

            {/* Settings Options */}
            <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Language Switch */}
              <TouchableOpacity
                onPress={() => setLang(lang === 'en' ? 'fr' : lang === 'fr' ? 'ar' : 'en')}
                style={styles.menuRow}
              >
                <View style={styles.menuLeft}>
                  <Feather name="globe" size={18} color={colors.brightPurple} />
                  <Text style={[styles.menuText, { color: colors.text }]}>Language: {lang.toUpperCase()}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.muted} />
              </TouchableOpacity>

              {/* Dark Mode Switch */}
              <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <Feather name={isDark ? 'moon' : 'sun'} size={18} color={colors.brightPurple} />
                  <Text style={[styles.menuText, { color: colors.text }]}>{t('darkMode')}</Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={setIsDark}
                  trackColor={{ false: '#767577', true: '#8B3DFF' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* 24-Hour Auto-delete */}
              <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <Feather name="clock" size={18} color={colors.brightPurple} />
                  <Text style={[styles.menuText, { color: colors.text }]}>{t('autoDelete')}</Text>
                </View>
                <Text style={{ color: colors.brightPurple, fontWeight: '700', fontSize: 13 }}>{t('twentyFourHours')}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setScreen('welcome')}
              style={[styles.logoutBtn, { borderColor: colors.danger + '55' }]}
            >
              <Feather name="log-out" size={16} color={colors.danger} />
              <Text style={{ color: colors.danger, fontWeight: 'bold', marginLeft: 8 }}>{t('logOut')}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Contacts Tab */}
        {mainTab === 'contacts' && (
          <FlatList
            data={INITIAL_USERS}
            keyExtractor={i => i.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.rowName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Matricule: {item.matricule}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setActiveUser(item);
                    setScreen('chat');
                  }}
                  style={styles.contactMsgBtn}
                >
                  <Feather name="message-square" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Discover Tab */}
        {mainTab === 'discover' && (
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>ACTIVE USERS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {INITIAL_USERS.map(u => (
                <View key={u.id} style={{ alignItems: 'center', marginRight: 16 }}>
                  <Image source={{ uri: u.avatar }} style={styles.discoverAvatar} />
                  <Text style={{ color: colors.text, fontSize: 12, marginTop: 4 }}>{u.name.split(' ')[0]}</Text>
                </View>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: colors.muted }]}>SUGGESTED GROUPS</Text>
            {['Study Group 2025', 'Mobile Developers', 'Designers Club'].map((grp, i) => (
              <View key={i} style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.groupIconBox}>
                  <Feather name="users" size={20} color={colors.brightPurple} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.rowName, { color: colors.text }]}>{grp}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>350+ members</Text>
                </View>
                <TouchableOpacity style={styles.joinBtn}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Bottom Navigation Bar */}
        <View style={[styles.bottomBar, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
          {[
            { id: 'chats', label: t('chats'), icon: 'message-square' },
            { id: 'contacts', label: t('contacts'), icon: 'users' },
            { id: 'discover', label: t('discover'), icon: 'compass' },
            { id: 'profile', label: t('profile'), icon: 'user' },
          ].map(tab => {
            const isActive = mainTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setMainTab(tab.id as any)}
                style={styles.navItem}
              >
                <Feather
                  name={tab.icon as any}
                  size={20}
                  color={isActive ? colors.primary : colors.muted}
                />
                <Text
                  style={[
                    styles.navLabel,
                    { color: isActive ? colors.primary : colors.muted, fontWeight: isActive ? 'bold' : 'normal' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Create Group Modal */}
        <Modal visible={isCreateGroupOpen} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.createGroupSheet, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>{t('createGroup')}</Text>
              <TextInput
                placeholder={t('groupName')}
                placeholderTextColor={colors.muted}
                style={[styles.inputRow, { color: colors.text, borderColor: colors.border, marginTop: 12 }]}
                defaultValue="Study Group"
              />
              <TouchableOpacity
                onPress={() => setIsCreateGroupOpen(false)}
                style={[styles.primaryBtn, { marginTop: 16 }]}
              >
                <LinearGradient colors={['#8B3DFF', '#A855F7']} style={styles.gradientBtn}>
                  <Text style={styles.btnTextWhite}>{t('create')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: { paddingHorizontal: 20, paddingTop: 8 },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  langText: { fontSize: 12, fontWeight: '700' },
  centerHero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B3DFF',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logoW: { color: '#FFFFFF', fontSize: 50, fontWeight: '900', letterSpacing: -2 },
  logoTitle: { fontSize: 36, fontWeight: '900', marginTop: 16, letterSpacing: -1 },
  slogan: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginTop: 8 },
  tagline: { fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  welcomeActions: { padding: 24, gap: 12 },
  primaryBtn: { borderRadius: 16, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  btnTextWhite: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  outlineBtn: { paddingVertical: 15, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
  backBtn: { padding: 16 },
  authScroll: { paddingHorizontal: 24, paddingBottom: 40 },
  authLogo: { alignItems: 'center', marginVertical: 16 },
  smallLogo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  smallLogoW: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  authTitle: { fontSize: 24, fontWeight: '800', marginTop: 12 },
  authSub: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  formContainer: { marginTop: 20, gap: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  textInput: { flex: 1, marginLeft: 12, fontSize: 14 },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  headerLogoBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerLogoW: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  headerTitle: { fontSize: 20, fontWeight: '800', marginLeft: 8 },
  headerRight: { marginLeft: 'auto' },
  iconBtn: { padding: 8, borderRadius: 20, borderWidth: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13 },
  subTabRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, alignItems: 'center' },
  subTabPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, marginRight: 8, borderWidth: 1 },
  subTabActive: { backgroundColor: '#8B3DFF', borderColor: '#8B3DFF' },
  subTabText: { fontSize: 12, fontWeight: '600' },
  newGroupBtn: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5 },
  avatarWrap: { position: 'relative' },
  avatarImg: { width: 48, height: 48, borderRadius: 24 },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#080810' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowName: { fontSize: 15, fontWeight: '700' },
  rowTime: { fontSize: 11 },
  lastMsg: { fontSize: 13, marginTop: 3 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  chatAvatar: { width: 40, height: 40, borderRadius: 20 },
  chatName: { fontSize: 15, fontWeight: '700' },
  p8: { padding: 8 },
  autoDeleteBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B0764', paddingVertical: 6, gap: 6 },
  autoDeleteText: { color: '#E9D5FF', fontSize: 11, fontWeight: '600' },
  msgRow: { marginVertical: 4 },
  msgOut: { alignItems: 'flex-end' },
  msgIn: { alignItems: 'flex-start' },
  msgBubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  msgBubbleOut: { borderBottomRightRadius: 4 },
  msgTextOut: { color: '#FFFFFF', fontSize: 14 },
  msgTextIn: { fontSize: 14 },
  msgTimeOut: { color: 'rgba(255,255,255,0.7)', fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },
  msgTimeIn: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },
  chatInputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
  inputFieldBox: { flex: 1, marginHorizontal: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chatInput: { fontSize: 14 },
  sendBtnCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B3DFF', alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheetContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderTopWidth: 1 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold' },
  sheetGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  sheetItem: { width: '30%', paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  optIconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  optLabel: { fontSize: 12, fontWeight: '600' },
  callContainer: { flex: 1, backgroundColor: '#080810', justifyContent: 'space-between', paddingVertical: 40, paddingHorizontal: 24 },
  callTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  callMinBtn: { padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  callTypeTitle: { color: '#C084FC', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
  callCenter: { alignItems: 'center' },
  pulseRing: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center' },
  callAvatar: { width: 140, height: 140, borderRadius: 70 },
  callName: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 24 },
  callDuration: { color: '#C084FC', fontSize: 15, fontWeight: '600', marginTop: 8 },
  callControlsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#121221', padding: 16, borderRadius: 32 },
  callCtrlBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  endCallBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  profileAvatarBorder: { width: 100, height: 100, borderRadius: 50, padding: 3, alignItems: 'center', justifyContent: 'center' },
  profileAvatar: { width: 94, height: 94, borderRadius: 47 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  greenPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  menuCard: { borderRadius: 20, borderWidth: 1, padding: 8, marginVertical: 12 },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 14, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, backgroundColor: 'rgba(239,68,68,0.1)' },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  contactMsgBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#8B3DFF', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginVertical: 8 },
  discoverAvatar: { width: 56, height: 56, borderRadius: 28 },
  groupCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  groupIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#8B3DFF22', alignItems: 'center', justifyContent: 'center' },
  joinBtn: { backgroundColor: '#8B3DFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, borderTopWidth: 1 },
  navItem: { alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 11, marginTop: 4 },
  createGroupSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
});
