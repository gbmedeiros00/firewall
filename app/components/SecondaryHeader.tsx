import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { FONTS, SPACING } from '../theme';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface SecondaryHeaderProps {
  title: string;
  onBack: () => void;
}

export default function SecondaryHeader({ title, onBack }: SecondaryHeaderProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MaterialIcons name="arrow-back" size={24} color={isDark ? colors.textPrimary : '#FFFFFF'} />
      </TouchableOpacity>
      
      <Text style={s.title}>{title}</Text>
      
      <MaterialIcons name="security" size={20} color={isDark ? colors.primary : '#FFFFFF'} />
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  header: {
    backgroundColor: isDark ? colors.background : colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xxxl, // Ajuste para a safe area
    borderBottomWidth: isDark ? 1 : 0,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: FONTS.headline,
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? colors.textPrimary : '#FFFFFF',
  },
});