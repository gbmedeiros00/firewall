import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

interface TextAreaProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function TextArea({ label, placeholder, value, onChangeText }: TextAreaProps) {
  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={s.wrap}>
        <TextInput
          style={s.field}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
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

const s = StyleSheet.create({
  group: { marginBottom: SPACING.lg },
  label: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: COLORS.secondary,
    letterSpacing: 0.7,
    marginBottom: SPACING.sm,
  },
  wrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.surface, // Sem borda visível até focar (opcional)
    padding: SPACING.md,
  },
  field: {
    minHeight: 100,
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textPrimary,
  },
});