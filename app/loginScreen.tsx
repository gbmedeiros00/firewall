import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from './theme';
import {
  ShieldFilledIcon,
  MailIcon,
  LockIcon,
  FaceIdIcon,
  ArrowRightIcon,
} from './icons';
import InputField from './components/InputField';


export default function LoginScreen({
  onNavigateToRegister,
  onLogin,
  onBiometric,
}: {
  onNavigateToRegister?: () => void;
  onLogin?: (email: string, password: string, token?: string) => void;
  onBiometric?: (type: 'fingerprint' | 'face') => void;
}) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]   = useState('');

  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  const canSubmit = email.includes('@') && password.length >= 6 && !isLoading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const API_URL = 'http://10.243.35.56:8080';
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await SecureStore.setItemAsync('user_email', email);
        await SecureStore.setItemAsync('user_token', data.token);
        onLogin?.(email, password, data.token);
      } else {
        setApiError('E-mail ou senha incorretos.');
      }
    } catch (error) {
      setApiError('Erro de conexão. Verifique se o backend está rodando na mesma rede.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      console.log('1. Verificando hardware biométrico...');
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Indisponível', 'Seu dispositivo não possui sensor biométrico.');
        return;
      }

      console.log('2. Verificando registros...');
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert('Sem Registros', 'Você precisa cadastrar uma digital/rosto nas configurações do aparelho primeiro.');
        return;
      }

      console.log('3. Acionando a tela nativa...');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Acesse seu Cofre Firewall',
        fallbackLabel: 'Usar Senha',
      });

      console.log('4. Resultado da biometria:', result);
      if (result.success) {
        // Busca os dados salvos no cofre do dispositivo
        const storedEmail = await SecureStore.getItemAsync('user_email');
        const storedToken = await SecureStore.getItemAsync('user_token');

        if (storedEmail && storedToken) {
          // Faz o login direto usando o token salvo!
          onLogin?.(storedEmail, 'biometric-login', storedToken);
        } else if (canSubmit) {
          handleLogin();
        } else {
          Alert.alert(
            'Primeiro Acesso',
            'Faça o login digitando seu e-mail e senha pelo menos uma vez para habilitar o acesso biométrico automático.'
          );
        }
      } else if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
        Alert.alert('Aviso', 'A biometria falhou ou foi cancelada pelo sistema. Motivo: ' + result.error);
      }
    } catch (error) {
      console.error('Erro crítico na biometria:', error);
      Alert.alert('Erro', 'Ocorreu uma falha ao acionar o leitor. Verifique o terminal.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={s.container}>

        {/* ── Logo ── */}
        <Animated.View style={[s.logoBlock, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={s.logoBox}>
            <ShieldFilledIcon size={32} color={COLORS.white} />
          </View>
          <Text style={s.brand}>FIREWALL</Text>
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View style={[s.form, { opacity: fade, transform: [{ translateY: slide }] }]}>

          <InputField
            label="E-mail"
            placeholder="nome@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            icon={<MailIcon size={18} color={COLORS.secondary} />}
            focused={focused === 'email'}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
          />

          <InputField
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secure
            showToggle
            visible={showPass}
            onToggle={() => setShowPass(v => !v)}
            icon={<LockIcon size={18} color={COLORS.secondary} />}
            focused={focused === 'pass'}
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
          />

          {apiError ? <Text style={s.apiErrorText}>{apiError}</Text> : null}

          {/* Primary button */}
          <TouchableOpacity
            style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={canSubmit ? 0.85 : 1}
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={s.primaryBtnText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Biometric */}
          <View style={s.biometricBlock}>
            <Text style={s.biometricLabel}>ACESSO RÁPIDO</Text>
            <View style={s.biometricRow}>

              {/* Fingerprint button — Outlined variant from design system */}
              <TouchableOpacity
                style={s.biometricBtn}
                onPress={handleBiometricAuth}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="fingerprint" size={26} color={COLORS.primary} />
              </TouchableOpacity>

              {/* Face ID button — Outlined variant */}
              <TouchableOpacity
                style={s.biometricBtn}
                onPress={handleBiometricAuth}
                activeOpacity={0.7}
              >
                <FaceIdIcon size={26} color={COLORS.primary} strokeWidth={1.5} />
              </TouchableOpacity>

            </View>
          </View>

          {/* Register link */}
          <TouchableOpacity style={s.registerLink} onPress={onNavigateToRegister}>
            <Text style={s.registerText}>Não sou cadastrado </Text>
            <Text style={s.registerBold}>— Criar conta</Text>
            <ArrowRightIcon size={13} color={COLORS.tertiary} strokeWidth={2.5} />
          </TouchableOpacity>

        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.white },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xxxl,
    justifyContent: 'center',
    paddingBottom: SPACING.xxxl,
  },

  // Logo
  logoBlock: { alignItems: 'center', marginBottom: 44 },
  logoBox: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    fontFamily: FONTS.headline,
    color: COLORS.primary,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: FONTS.body,
    color: COLORS.secondary,
    letterSpacing: 2,
    marginTop: 4,
  },

  // Form
  form: { width: '100%' },


  apiErrorText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.error,
    textAlign: 'center',
  },

  // Primary button — matches "Primary" variant from design system
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xxxl,
  },
  primaryBtnDisabled: {
    backgroundColor: COLORS.secondary,
    opacity: 0.5,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.body,
    letterSpacing: 0.3,
  },

  // Biometric — "Outlined" variant from design system
  biometricBlock: { alignItems: 'center', marginBottom: SPACING.xxxl },
  biometricLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: COLORS.secondary,
    letterSpacing: 1.4,
    marginBottom: SPACING.md,
  },
  biometricRow: { flexDirection: 'row', gap: SPACING.md },
  biometricBtn: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.tertiaryFaint,
    borderWidth: 1.5,
    borderColor: `${COLORS.tertiary}40`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Register link
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  registerText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  registerBold: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.tertiary,
    fontWeight: '700',
  },
});