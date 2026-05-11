import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS, SPACING, ThemeColors } from '../theme';
import { useTheme } from '../contexts/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={s.headerBlock}>
      <Text style={s.title}>{title}</Text>
      {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  headerBlock: {
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.headline,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});