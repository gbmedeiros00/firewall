import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../theme';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface CategorySelectorProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySelector({ categories, selected, onSelect }: CategorySelectorProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={s.container}>
      <Text style={s.label}>CATEGORIA</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {categories.map((cat) => {
          const isActive = selected === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[s.pill, isActive && s.pillActive]}
              onPress={() => onSelect(cat)}
              activeOpacity={0.7}
            >
              <Text style={[s.text, isActive && s.textActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.secondary,
    letterSpacing: 0.7,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    gap: SPACING.sm,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  textActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});