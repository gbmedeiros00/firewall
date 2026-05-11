import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { ShieldAlert, AlertTriangle, ShieldCheck, ChevronRight, Shield } from 'lucide-react-native';
import { FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import ScreenWrapper from '../components/ScreenWrapper';
import PageHeader from '../components/PageHeader';
import { ShieldFilledIcon } from '../icons';
import { API_URL } from '../config';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface AuditScreenProps {
  token?: string | null;
  onNavigateToDetail?: (credential: any) => void;
}

export default function AuditScreen({ token, onNavigateToDetail }: AuditScreenProps) {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCredentials, setHasCredentials] = useState(true);

  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  useEffect(() => {
    if (token) fetchHealthReport();
  }, [token]);

  const fetchHealthReport = async () => {
    setIsLoading(true);
    try {
      const [healthRes, credsRes] = await Promise.all([
        fetch(`${API_URL}/api/vault/health`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/credentials`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (healthRes.ok) setReport(await healthRes.json());
      
      if (credsRes.ok) {
        const creds = await credsRes.json();
        setHasCredentials(creds.length > 0);
      } else {
        setHasCredentials(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const score = report?.score ?? 100;
  const pwnedIssues = report?.issues?.filter((i: any) => i.issueType === 'PWNED') || [];
  const reusedIssues = report?.issues?.filter((i: any) => i.issueType === 'REUSED') || [];
  const weakIssues = report?.issues?.filter((i: any) => i.issueType === 'WEAK') || [];

  // Cor do círculo de pontuação
  const scoreColor = score < 60 ? colors.error : score < 90 ? colors.warning : colors.success;

  const translateTag = (tag: string) => {
    if (tag === 'PWNED') return 'VAZADA';
    if (tag === 'WEAK') return 'FRACA';
    if (tag === 'REUSED') return 'REUSADA';
    return tag;
  };

  const renderIssueList = (issues: any[], title: string, IconComponent: any, color: string, bgColor: string) => {
    if (issues.length === 0) return null;
    return (
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <IconComponent size={18} color={color} />
          <Text style={[s.sectionTitle, { color }]}>{title}</Text>
          <View style={[s.badge, { backgroundColor: bgColor }]}>
            <Text style={[s.badgeText, { color }]}>{issues.length}</Text>
          </View>
        </View>
        <View style={s.cardList}>
          {issues.map((issue: any, index: number) => (
            <TouchableOpacity 
              key={`${issue.credentialId}-${index}`}
              style={[s.issueCard, index < issues.length - 1 && s.borderBottom]}
              onPress={() => onNavigateToDetail?.({ id: issue.credentialId, title: issue.title, username: issue.username })}
              activeOpacity={0.7}
            >
              <View style={s.issueContent}>
                <Text style={s.issueTitle}>{issue.title}</Text>
                <Text style={s.issueSubtitle}>{issue.username}</Text>
              </View>
              <View style={[s.tag, { backgroundColor: bgColor }]}>
                <Text style={[s.tagText, { color }]}>{translateTag(issue.issueType)}</Text>
              </View>
              <ChevronRight size={16} color={colors.placeholder} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : colors.primary} />
      
      {/* Header Superior Fixo */}
      <View style={s.topHeader}>
        <View style={s.brandRow}>
          <ShieldFilledIcon size={20} color={isDark ? colors.primary : '#FFFFFF'} />
          <Text style={s.topHeaderTitle}>FIREWALL</Text>
        </View>
      </View>

      <View style={s.mainContent}>
        <ScreenWrapper contentContainerStyle={s.scrollContent}>
          <PageHeader title="Auditoria" subtitle="Identifique e corrija pontos de fricção" />

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Dashboard Superior (Gráfico e Resumo) */}
              <View style={s.dashboard}>
                <View style={[s.circleScore, { borderColor: hasCredentials ? scoreColor : colors.border }]}>
                  <Text style={[s.scoreValue, { color: hasCredentials ? scoreColor : colors.textSecondary }]}>{hasCredentials ? score : '--'}</Text>
                  <Text style={s.scoreLabel}>PONTOS</Text>
                </View>
                
                <View style={s.summaryCards}>
                  <View style={[s.summaryCard, { backgroundColor: `${colors.error}10`, borderColor: `${colors.error}30` }]}>
                    <Text style={[s.summaryCardNumber, { color: colors.error }]}>{hasCredentials ? pwnedIssues.length : '-'}</Text>
                    <Text style={[s.summaryCardLabel, { color: colors.error }]}>Violadas</Text>
                  </View>
                  <View style={[s.summaryCard, { backgroundColor: `${colors.warning}10`, borderColor: `${colors.warning}30` }]}>
                    <Text style={[s.summaryCardNumber, { color: colors.warning }]}>{hasCredentials ? reusedIssues.length : '-'}</Text>
                    <Text style={[s.summaryCardLabel, { color: colors.warning }]}>Reusadas</Text>
                  </View>
                </View>
              </View>

              {!hasCredentials ? (
                <View style={s.perfectScoreBox}>
                  <Shield size={48} color={colors.neutral} />
                  <Text style={[s.perfectScoreTitle, { color: colors.textPrimary }]}>Cofre Vazio</Text>
                  <Text style={s.perfectScoreText}>Adicione credenciais ao seu cofre para que a auditoria possa analisar a segurança delas.</Text>
                </View>
              ) : report?.issues?.length === 0 ? (
                <View style={s.perfectScoreBox}>
                  <ShieldCheck size={48} color={colors.success} />
                  <Text style={s.perfectScoreTitle}>Cofre Impenetrável</Text>
                  <Text style={s.perfectScoreText}>Nenhuma vulnerabilidade ou senha repetida encontrada em seus registros.</Text>
                </View>
              ) : (
                <View style={s.listsContainer}>
                  {renderIssueList(pwnedIssues, 'Senhas Violadas (Risco Crítico)', ShieldAlert, colors.error, `${colors.error}15`)}
                  {renderIssueList(reusedIssues, 'Senhas Reutilizadas', AlertTriangle, colors.warning, `${colors.warning}20`)}
                  {renderIssueList(weakIssues, 'Senhas Fracas', AlertTriangle, colors.neutral, colors.surfaceAlt)}
                </View>
              )}
            </>
          )}

          <View style={s.bottomSpacer} />
        </ScreenWrapper>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mainContent: { flex: 1, backgroundColor: colors.background },
  topHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xxl,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
    paddingBottom: 16, backgroundColor: isDark ? colors.background : colors.primary,
    borderBottomWidth: isDark ? 1 : 0,
    borderBottomColor: colors.border,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  topHeaderTitle: {
    fontFamily: FONTS.headline, fontSize: 16, fontWeight: '800',
    color: isDark ? colors.primary : '#FFFFFF', letterSpacing: 1.5,
  },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: 100 },
  
  // Dashboard
  dashboard: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.xxxl, gap: SPACING.xl,
  },
  circleScore: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
    ...SHADOWS.card,
  },
  scoreValue: { fontFamily: FONTS.headline, fontSize: 36, fontWeight: 'bold' },
  scoreLabel: { fontFamily: FONTS.body, fontSize: 10, fontWeight: '700', color: colors.placeholder, letterSpacing: 1 },
  
  summaryCards: { flex: 1, gap: SPACING.sm },
  summaryCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1,
  },
  summaryCardNumber: { fontFamily: FONTS.headline, fontSize: 20, fontWeight: 'bold' },
  summaryCardLabel: { fontFamily: FONTS.body, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Perfect Score
  perfectScoreBox: { alignItems: 'center', paddingHorizontal: SPACING.xxl, marginTop: SPACING.xl },
  perfectScoreTitle: { fontFamily: FONTS.headline, fontSize: 20, fontWeight: 'bold', color: colors.success, marginTop: SPACING.md, marginBottom: SPACING.sm },
  perfectScoreText: { fontFamily: FONTS.body, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  // Lists
  listsContainer: { paddingHorizontal: SPACING.xl },
  section: { marginBottom: SPACING.xxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.sm },
  sectionTitle: { fontFamily: FONTS.body, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full, marginLeft: 'auto' },
  badgeText: { fontFamily: FONTS.body, fontSize: 10, fontWeight: '800' },
  
  cardList: { backgroundColor: colors.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...SHADOWS.card },
  issueCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.border },
  issueContent: { flex: 1 },
  issueTitle: { fontFamily: FONTS.body, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  issueSubtitle: { fontFamily: FONTS.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  tagText: { fontFamily: FONTS.body, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  
  bottomSpacer: { height: 120 },
});