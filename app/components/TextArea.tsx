import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../theme';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface TextAreaProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function TextArea({ label, placeholder, value, onChangeText }: TextAreaProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={s.wrap}>
        <TextInput
          style={s.field}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  group: { marginBottom: SPACING.lg },
  label: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.secondary,
    letterSpacing: 0.7,
    marginBottom: SPACING.sm,
  },
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: SPACING.md,
  },
  field: {
    minHeight: 100,
    fontSize: 14,
    fontFamily: FONTS.body,
    color: colors.textPrimary,
  },
});