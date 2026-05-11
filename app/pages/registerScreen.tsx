import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { FONTS, SPACING, RADIUS } from '../theme';
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
import ScreenWrapper from '../components/ScreenWrapper';
import { API_URL } from '../config';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';


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

  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

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
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : colors.primary} />

      <View style={s.header}>
        <ShieldFilledIcon size={22} color={isDark ? colors.primary : '#FFFFFF'} />
        <Text style={s.headerBrand}>FIREWALL</Text>
      </View>

      <ScreenWrapper
        contentContainerStyle={s.content}
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
          icon={<MailIcon size={18} color={colors.secondary} />}
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
          icon={<LockIcon size={18} color={colors.secondary} />}
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
          icon={<LockIcon size={18} color={colors.secondary} />}
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
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={s.btnText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.loginLink} onPress={onNavigateToLogin}>
          <Text style={s.loginLinkText}>Já tenho conta </Text>
          <ArrowRightIcon size={14} color={colors.primary} strokeWidth={2.5} />
          <Text style={s.loginLinkBold}> Entrar</Text>
        </TouchableOpacity>

        <View style={s.zkBadge}>
          <ZeroKnowledgeIcon size={18} color={colors.secondary} />
          <Text style={s.zkText}>ARQUITETURA ZERO-KNOWLEDGE</Text>
        </View>

        {/* Respiro final garantido para forçar a rolagem até o fim */}
        <View style={s.bottomSpacer} />
      </ScreenWrapper>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  root:   { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: isDark ? colors.background : colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 54,
    gap: SPACING.sm,
    borderBottomWidth: isDark ? 1 : 0,
    borderBottomColor: colors.border,
  },
  headerBrand: {
    color: isDark ? colors.primary : '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: FONTS.headline,
  },
  content:  { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxl, paddingBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: FONTS.headline,
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
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
    backgroundColor: colors.surfaceAlt,
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
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  reqTitle: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.neutral,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  reqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: colors.error,
    marginTop: -10,
    marginBottom: SPACING.md,
  },
  apiErrorText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  legal: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  btnDisabled: { backgroundColor: colors.secondary, opacity: 0.5 },
  btnText: {
    color: '#FFFFFF',
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
  loginLinkText: { fontSize: 14, fontFamily: FONTS.body, color: colors.textSecondary },
  loginLinkBold: { fontSize: 14, fontFamily: FONTS.body, color: colors.primary, fontWeight: '700' },
  zkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  zkText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.secondary,
    letterSpacing: 1.2,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 60 : 100, // Força um bloco invisível no final da tela
  },
});