import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatConversationScreen } from '../screens/ChatConversationScreen';
import { NewMessageScreen } from '../screens/NewMessageScreen';
import { CreateGroupScreen } from '../screens/CreateGroupScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BottomNav, NavTab } from '../components/BottomNav';
import { CallModal } from '../components/CallModal';

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Navigation stack state
  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    return isAuthenticated ? 'home' : 'welcome';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('chats');

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
    if (screen === 'home') setActiveTab('chats');
    else if (screen === 'contacts') setActiveTab('contacts');
    else if (screen === 'discover') setActiveTab('discover');
    else if (screen === 'profile') setActiveTab('profile');
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'chats') setCurrentScreen('home');
    else if (tab === 'contacts') setCurrentScreen('contacts');
    else if (tab === 'discover') setCurrentScreen('discover');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  // Determine if bottom navigation should be visible
  const isMainTabScreen = ['home', 'contacts', 'discover', 'profile'].includes(currentScreen);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden select-none">
      {/* Screen Render */}
      <div className="flex-1 overflow-hidden relative">
        {currentScreen === 'welcome' && <WelcomeScreen onNavigate={navigate} />}
        {currentScreen === 'signup' && <SignupScreen onNavigate={navigate} />}
        {currentScreen === 'login' && <LoginScreen onNavigate={navigate} />}
        {currentScreen === 'language' && <LanguageScreen onNavigate={navigate} />}
        
        {currentScreen === 'home' && <HomeScreen onNavigate={navigate} />}
        {currentScreen === 'contacts' && <ContactsScreen onNavigate={navigate} />}
        {currentScreen === 'discover' && <DiscoverScreen onNavigate={navigate} />}
        {currentScreen === 'profile' && <ProfileScreen onNavigate={navigate} />}
        
        {currentScreen === 'conversation' && <ChatConversationScreen onNavigate={navigate} />}
        {currentScreen === 'new_message' && <NewMessageScreen onNavigate={navigate} />}
        {currentScreen === 'create_group' && <CreateGroupScreen onNavigate={navigate} />}
        {currentScreen === 'settings' && <SettingsScreen onNavigate={navigate} />}
      </div>

      {/* Bottom Navigation on main tabs */}
      {isMainTabScreen && (
        <BottomNav currentTab={activeTab} onSelectTab={handleSelectTab} />
      )}

      {/* Global Call Overlay (Voice/Video) */}
      <CallModal />
    </div>
  );
};
