import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS, RADIUS, SPACING, SHADOWS } from '../theme';
import { ChevronRight, ShieldAlert } from 'lucide-react-native'; 
import { useTheme, ThemeColors } from '../contexts/ThemeContext';


export interface VaultItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  categoryColor: string;
  warning?: boolean;
}

export default function VaultItemCard({ title, subtitle, icon, categoryColor, warning }: VaultItemProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.8}>
      {/* Indicador de Categoria Lateral */}
      <View style={[s.indicator, { backgroundColor: categoryColor }]} />
      
      <View style={s.content}>
        <View style={s.iconWrap}>{icon}</View>
        
        <View style={s.textWrap}>
          <View style={s.titleRow}>
            <Text style={s.title}>{title}</Text>
            {warning && (
              <View style={s.warningBadge}>
                <Text style={s.warningText}>SENHA FRACA</Text>
              </View>
            )}
          </View>
          <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text>
        </View>

        <ChevronRight size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  indicator: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textWrap: {
    flex: 1,
    marginRight: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 2,
  },
  title: {
    fontFamily: FONTS.body,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary, // White (High Emphasis no Dark Mode)
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  warningBadge: {
    backgroundColor: `${colors.error}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `${colors.error}40`,
  },
  warningText: {
    fontSize: 9,
    fontFamily: FONTS.body,
    fontWeight: '800',
    color: colors.error,
  },
}); 