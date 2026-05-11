import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '../theme';
import { CheckIcon } from '../icons';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

export default function RequirementChip({ met, label }: { met: boolean; label: string }) {
  const { colors, isDark } = useTheme();
  const chip = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={[chip.wrap, met && chip.wrapMet]}>
      <View style={[chip.icon, met && chip.iconMet]}>
        {met && <CheckIcon size={10} color="#FFFFFF" strokeWidth={3} />}
      </View>
      <Text style={[chip.label, met && chip.labelMet]}>{label}</Text>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  wrapMet: {
    borderColor: `${colors.success}55`,
    backgroundColor: `${colors.success}12`,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  iconMet: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  labelMet: { color: colors.success },
});