import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../theme';

interface SecondaryHeaderProps {
  title: string;
  onBack: () => void;
}

export default function SecondaryHeader({ title, onBack }: SecondaryHeaderProps) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>
      
      <Text style={s.title}>{title}</Text>
      
      <MaterialIcons name="security" size={20} color={COLORS.white} />
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xxxl, // Ajuste para a safe area
  },
  title: {
    fontFamily: FONTS.headline,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
});