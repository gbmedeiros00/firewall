import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../theme';
import { ShieldCheck, ShieldAlert, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

export interface CredentialIssue {
  credentialId: string | number;
  title: string;
  username: string;
  issueType: 'PWNED' | 'WEAK' | 'REUSED';
  description: string;
}

export interface VaultHealthReport {
  score: number;
  issues: CredentialIssue[];
}

interface HealthScoreCardProps {
  report?: VaultHealthReport;
  isLoading?: boolean;
  onSeeDetails?: () => void;
}

export default function HealthScoreCard({ report, isLoading, onSeeDetails }: HealthScoreCardProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  // Definições de cores e ícones baseadas na pontuação (Health Score)
  const score = report?.score ?? 100;
  const isDanger = score < 60;
  const isWarning = score >= 60 && score < 90;
  
  const statusColor = isDanger ? colors.error : isWarning ? colors.warning : colors.success;
  const StatusIcon = isDanger ? ShieldAlert : isWarning ? AlertTriangle : ShieldCheck;

  // Agrupamento de problemas
  const pwnedCount = report?.issues.filter(i => i.issueType === 'PWNED').length || 0;
  const issuesCount = report?.issues?.length || 0;

  return (
    <View style={s.container}>
      <View style={[s.card, { backgroundColor: statusColor }]}>
        <View style={s.header}>
          <Text style={s.label}>SAÚDE DO COFRE</Text>
          <StatusIcon size={24} color="#FFFFFF" />
        </View>
        
        <Text style={s.score}>{isLoading ? '--' : `${score}%`}</Text>
        
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${score}%` }]} />
        </View>
        
        {issuesCount === 0 ? (
          <Text style={s.footerText}>Excelente! Todas as suas credenciais estão seguras.</Text>
        ) : (
          <Text style={s.footerText}>
            {pwnedCount > 0 
              ? `Atenção: ${pwnedCount} senhas encontradas em vazamentos.` 
              : `${issuesCount} itens precisam de atenção (fracas ou repetidas).`}
          </Text>
        )}

        {issuesCount > 0 && !isLoading && (
          <TouchableOpacity style={s.detailsBtn} onPress={onSeeDetails} activeOpacity={0.8}>
            <Text style={s.detailsBtnText}>Ver detalhes</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  score: {
    fontFamily: FONTS.headline,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    marginBottom: SPACING.sm,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  detailsBtnText: {
    fontFamily: FONTS.body,
    fontWeight: '700',
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 4,
  },
});