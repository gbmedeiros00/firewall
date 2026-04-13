import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

interface TotpCardProps {
  code: string;
  timeLeft: number;
}

export default function TotpCard({ code, timeLeft }: TotpCardProps) {
  return (
    <View style={s.card}>
      <View style={s.content}>
        <Text style={s.label}>CÓDIGO DE VERIFICAÇÃO</Text>
        <Text style={s.code}>{code}</Text>
      </View>
      
      {/* Círculo de tempo simulado */}
      <View style={s.timerCircle}>
        <Text style={s.timerText}>{timeLeft}s</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.body,
    fontWeight: '700',
    color: COLORS.textDisabled,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  code: {
    fontSize: 32,
    fontFamily: FONTS.mono, // Fonte monoespaçada para números
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 4,
  },
  timerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },
});