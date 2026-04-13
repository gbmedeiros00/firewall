import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './pages/loginScreen';
import RegisterScreen from './pages/registerScreen';
import VaultHomeScreen from './pages/VaultHomeScreen';
import AddCredentialScreen from './pages/AddCredentialScreen';
import CredentialDetailScreen from './pages/CredentialDetailScreen';
import EditCredentialScreen from './pages/EditCredentialScreen';

type Screen = 'login' | 'register' | 'vault' | 'add_credential' | 'detail_credential' | 'edit_credential';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState<string | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<any>(null);

  return (
    <View style={s.root}>
      {screen === 'login' ? (
        <LoginScreen
          onNavigateToRegister={() => setScreen('register')}
          onLogin={(email, pw, jwtToken) => {
            if (jwtToken) {
              setToken(jwtToken);
              setScreen('vault');
            }
          }}
        />
      ) : screen === 'register' ? (
        <RegisterScreen
          onNavigateToLogin={() => setScreen('login')}
        />
      ) : screen === 'vault' ? (
        <VaultHomeScreen 
          token={token} 
          onLogout={async () => { 
            await SecureStore.deleteItemAsync('user_email');
            await SecureStore.deleteItemAsync('user_token');
            setToken(null); 
            setScreen('login'); 
          }}
          onLock={() => setScreen('login')}
          onNavigateToAdd={() => setScreen('add_credential')}
          onNavigateToDetail={(cred) => {
            setSelectedCredential(cred);
            setScreen('detail_credential');
          }}
        />
      ) : screen === 'add_credential' ? (
        <AddCredentialScreen
          token={token}
          onBack={() => setScreen('vault')}
        />
      ) : screen === 'edit_credential' ? (
        <EditCredentialScreen
          token={token}
          credential={selectedCredential}
          onBack={() => setScreen('detail_credential')}
          onSave={(updated) => {
            setSelectedCredential(updated);
            setScreen('detail_credential');
          }}
        />
      ) : (
        <CredentialDetailScreen
          credential={selectedCredential}
          onEdit={() => setScreen('edit_credential')}
          onBack={() => setScreen('vault')}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({ root: { flex: 1 } });