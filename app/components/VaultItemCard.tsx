import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../theme';
// Substitua pelos seus ícones (lucide-react-native ou expo-vector-icons)
import { ChevronRight, ShieldAlert } from 'lucide-react-native'; 

export interface VaultItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  categoryColor: string;
  warning?: boolean;
}

export default function VaultItemCard({ title, subtitle, icon, categoryColor, warning }: VaultItemProps) {
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

        <ChevronRight size={20} color={COLORS.placeholder} />
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.card,
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
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
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
    color: COLORS.primary,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  warningBadge: {
    backgroundColor: `${COLORS.error}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 9,
    fontFamily: FONTS.body,
    fontWeight: '800',
    color: COLORS.error,
  },
}); 