import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import {
  ShieldFilledIcon,
  MailIcon,
  LockIcon,
  ZeroKnowledgeIcon,
  ArrowRightIcon,
} from '../icons';
import InputField from '../components/InputField';
import RequirementChip from '../components/RequirementChip';
import { getStrength, getRequirements } from '../utils/passwordUtils';


export default function RegisterScreen({
  onNavigateToLogin,
}: {
  onNavigateToLogin?: () => void;
}) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]   = useState('');

  const strength  = getStrength(password);
  const reqs      = getRequirements(password);
  const allMet    = reqs.every(r => r.met);
  const matchOk   = confirm.length > 0 && confirm === password;
  const matchErr  = confirm.length > 0 && confirm !== password;
  const canSubmit = email.includes('@') && allMet && matchOk && !isLoading;

  const handleRegister = async () => {
    if (!canSubmit) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const API_URL = 'http://10.243.35.56:8080';
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        onNavigateToLogin?.();
      } else {
        const errorData = await response.json().catch(() => null);
        setApiError(errorData?.message || 'Erro ao registrar. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      setApiError('Erro de conexão. Verifique se o backend está rodando e a URL está correta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={s.root} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={s.header}>
        <ShieldFilledIcon size={22} color={COLORS.white} />
        <Text style={s.headerBrand}>FIREWALL</Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.title}>Crie sua conta</Text>
        <Text style={s.subtitle}>
          Sua segurança começa com uma Senha Mestra inquebável.
        </Text>

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
          label="Senha Mestra"
          placeholder="••••••••••••"
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

        {password.length > 0 && (
          <View style={s.strengthRow}>
            <View style={s.strengthTrack}>
              {[0, 1, 2, 3].map(i => (
                <View
                  key={i}
                  style={[
                    s.strengthSeg,
                    i < strength.filled && { backgroundColor: strength.color },
                  ]}
                />
              ))}
            </View>
            <Text style={[s.strengthLabel, { color: strength.color }]}>
              {strength.label.toUpperCase()}
            </Text>
          </View>
        )}

        <View style={s.reqBox}>
          <Text style={s.reqTitle}>REQUISITOS MÍNIMOS</Text>
          <View style={s.reqGrid}>
            {reqs.map(r => (
              <RequirementChip key={r.key} met={r.met} label={r.label} />
            ))}
          </View>
        </View>

        <InputField
          label="Confirmar Senha Mestra"
          placeholder="••••••••••••"
          value={confirm}
          onChangeText={setConfirm}
          secure
          showToggle
          visible={showConf}
          onToggle={() => setShowConf(v => !v)}
          icon={<LockIcon size={18} color={COLORS.secondary} />}
          focused={focused === 'confirm'}
          onFocus={() => setFocused('confirm')}
          onBlur={() => setFocused(null)}
          error={matchErr}
          success={matchOk}
        />
        {matchErr && <Text style={s.errorText}>As senhas não coincidem</Text>}

        <Text style={s.legal}>
          Ao criar sua conta, você concorda que a FIREWALL não possui acesso à sua
          Senha Mestra. Perder essa senha resultará na perda definitiva dos seus dados.
        </Text>

        {apiError ? <Text style={s.apiErrorText}>{apiError}</Text> : null}

        <TouchableOpacity
          style={[s.btn, !canSubmit && s.btnDisabled]}
          onPress={handleRegister}
          activeOpacity={canSubmit ? 0.85 : 1}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={s.btnText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.loginLink} onPress={onNavigateToLogin}>
          <Text style={s.loginLinkText}>Já tenho conta </Text>
          <ArrowRightIcon size={14} color={COLORS.primary} strokeWidth={2.5} />
          <Text style={s.loginLinkBold}> Entrar</Text>
        </TouchableOpacity>

        <View style={s.zkBadge}>
          <ZeroKnowledgeIcon size={18} color={COLORS.secondary} />
          <Text style={s.zkText}>ARQUITETURA ZERO-KNOWLEDGE</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.white },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 54,
    gap: SPACING.sm,
  },
  headerBrand: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: FONTS.headline,
  },
  scroll:   { flex: 1 },
  content:  { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxl, paddingBottom: 120 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xxxl,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: -8,
    marginBottom: SPACING.lg,
  },
  strengthTrack: { flex: 1, flexDirection: 'row', gap: 5 },
  strengthSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.surfaceAlt,
  },
  strengthLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    letterSpacing: 0.5,
    minWidth: 80,
    textAlign: 'right',
  },
  reqBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  reqTitle: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: COLORS.neutral,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  reqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.error,
    marginTop: -10,
    marginBottom: SPACING.md,
  },
  apiErrorText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  legal: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  btnDisabled: { backgroundColor: COLORS.secondary, opacity: 0.5 },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.body,
    letterSpacing: 0.3,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxxl,
  },
  loginLinkText: { fontSize: 14, fontFamily: FONTS.body, color: COLORS.textSecondary },
  loginLinkBold: { fontSize: 14, fontFamily: FONTS.body, color: COLORS.primary, fontWeight: '700' },
  zkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  zkText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: COLORS.secondary,
    letterSpacing: 1.2,
  },
});