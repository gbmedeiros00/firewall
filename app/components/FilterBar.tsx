import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

const FILTERS = ['Tudo', 'Trabalho', 'Pessoal', 'Bancos'];

export default function FilterBar() {
  const [activeFilter, setActiveFilter] = useState('Tudo');

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.container}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[s.pill, isActive && s.pillActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text style={[s.text, isActive && s.textActive]}>{filter}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  textActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
});