import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../theme';
import { Copy, Eye, EyeOff, ExternalLink } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface DetailFieldProps {
  label: string;
  value: string;
  isPassword?: boolean;
  isLink?: boolean;
  onCopy?: () => void;
  onLinkPress?: () => void;
}

export default function DetailField({ label, value, isPassword, isLink, onCopy, onLinkPress }: DetailFieldProps) {
  const [visible, setVisible] = useState(!isPassword);
  
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const displayValue = isPassword && !visible ? '••••••••••••••••' : value;

  return (
    <View style={s.container}>
      <Text style={s.label}>{label}</Text>
      <View style={s.valueRow}>
        <Text style={[s.value, isLink && s.linkValue]} numberOfLines={1}>
          {displayValue}
        </Text>
        
        <View style={s.actions}>
          {isPassword && (
            <TouchableOpacity onPress={() => setVisible(!visible)} style={s.iconBtn}>
              {visible ? <EyeOff size={18} color={colors.neutral} /> : <Eye size={18} color={colors.neutral} />}
            </TouchableOpacity>
          )}
          
          {isLink && (
            <TouchableOpacity onPress={onLinkPress} style={s.iconBtn}>
              <ExternalLink size={18} color={colors.neutral} />
            </TouchableOpacity>
          )}

          {!isLink && (
            <TouchableOpacity onPress={onCopy} style={s.iconBtn}>
              <Copy size={18} color={colors.neutral} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  linkValue: {
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBtn: {
    padding: 4,
  },
});