import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

interface CategorySelectorProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySelector({ categories, selected, onSelect }: CategorySelectorProps) {
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

const s = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: COLORS.secondary,
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
    backgroundColor: COLORS.surface,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  textActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
});