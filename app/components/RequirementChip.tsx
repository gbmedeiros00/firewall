import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../theme';
import { CheckIcon } from '../icons';

export default function RequirementChip({ met, label }: { met: boolean; label: string }) {
  return (
    <View style={[chip.wrap, met && chip.wrapMet]}>
      <View style={[chip.icon, met && chip.iconMet]}>
        {met && <CheckIcon size={10} color={COLORS.white} strokeWidth={3} />}
      </View>
      <Text style={[chip.label, met && chip.labelMet]}>{label}</Text>
    </View>
  );
}

const chip = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  wrapMet: {
    borderColor: `${COLORS.success}55`,
    backgroundColor: `${COLORS.success}12`,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  iconMet: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelMet: { color: COLORS.success },
});