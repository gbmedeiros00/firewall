import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from './contexts/ThemeContext';
import LoginScreen from './pages/loginScreen';
import RegisterScreen from './pages/registerScreen';
import VaultHomeScreen from './pages/VaultHomeScreen';
import AddCredentialScreen from './pages/AddCredentialScreen';
import EditCredentialScreen from './pages/EditCredentialScreen';
import CredentialDetailScreen from './pages/CredentialDetailScreen';
import AuditScreen from './pages/AuditScreen';
import SettingsScreen from './pages/SettingsScreen';
import BottomNavBar, { Tab } from './components/BottomNavBar';

export default function AppIndex() {
  const { colors, isDark } = useTheme();
  
  // Gerenciadores de Estado Mestre
  const [token, setToken] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [selectedCredential, setSelectedCredential] = useState<any>(null);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('user_token');
      if (storedToken) {
        setToken(storedToken);
        setCurrentScreen('vault');
      } else {
        setCurrentScreen('login');
      }
    } catch (e) {
      setCurrentScreen('login');
    }
  };

  const handleLogin = (email: string, pass: string, jwtToken?: string) => {
    if (jwtToken) {
      setToken(jwtToken);
      setCurrentScreen('vault');
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('user_token');
    await SecureStore.deleteItemAsync('user_email');
    setToken(null);
    setCurrentScreen('login');
  };

  const handleLock = () => {
    setCurrentScreen('login');
  };

  // Orquestrador de Telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setCurrentScreen('register')} />;
      case 'register':
        return <RegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
      case 'vault':
        return (
          <VaultHomeScreen 
            token={token} 
            onNavigateToAdd={() => setCurrentScreen('add')} 
            onNavigateToAudit={() => setCurrentScreen('audit')} 
            onNavigateToDetail={(cred) => {
              setSelectedCredential(cred);
              setCurrentScreen('detail');
            }} 
          />
        );
      case 'add':
        return <AddCredentialScreen token={token} onBack={() => setCurrentScreen('vault')} />;
      case 'edit':
        return (
          <EditCredentialScreen 
            token={token} 
            credential={selectedCredential} 
            onBack={() => setCurrentScreen('detail')} 
            onSave={(updated) => {
              setSelectedCredential(updated);
              setCurrentScreen('detail');
            }} 
          />
        );
      case 'detail':
        return (
          <CredentialDetailScreen 
            token={token} 
            credential={selectedCredential} 
            onBack={() => setCurrentScreen('vault')} 
            onEdit={() => setCurrentScreen('edit')} 
            onDeleteSuccess={() => setCurrentScreen('vault')} 
          />
        );
      case 'audit':
        return (
          <AuditScreen 
            token={token} 
            onNavigateToDetail={(cred) => {
              setSelectedCredential(cred);
              setCurrentScreen('detail');
            }} 
          />
        );
      case 'settings':
        return <SettingsScreen token={token} onLock={handleLock} onLogout={handleLogout} />;
      default:
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setCurrentScreen('register')} />;
    }
  };

  const showNavBar = ['vault', 'audit', 'settings'].includes(currentScreen);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? colors.background : colors.primary }]}>
      <View style={styles.container}>
        {renderScreen()}
      </View>
      {showNavBar && (
        <BottomNavBar 
          activeTab={currentScreen as Tab} 
          onTabPress={(tab) => setCurrentScreen(tab)} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
});