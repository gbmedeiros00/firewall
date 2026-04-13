import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { ShieldCheck, Plus } from 'lucide-react-native';

interface HealthScoreCardProps {
  onAdd?: () => void;
}

export default function HealthScoreCard({ onAdd }: HealthScoreCardProps) {
  return (
    <View style={s.card}>
      {/* =======================================================
          PONTUAÇÃO DE SAÚDE COMENTADA CONFORME SOLICITADO
      <View style={s.header}>
        <Text style={s.label}>PONTUAÇÃO DE SAÚDE</Text>
        <ShieldCheck size={24} color={COLORS.secondary} />
      </View>
      
      <Text style={s.score}>84</Text>
      
      {/* Barra de Progresso 
      <View style={s.progressTrack}>
        <View style={s.progressFill} />
      </View>
      
      <Text style={s.footerText}>3 itens precisam de atenção imediata</Text>
      ======================================================= */}

      {/* Botão Flutuante (FAB) Principal */}
      <TouchableOpacity style={s.fab} activeOpacity={0.8} onPress={onAdd}>
        <Plus size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    // backgroundColor: COLORS.primary,
    // borderRadius: RADIUS.xl,
    // padding: SPACING.lg,
    // marginTop: SPACING.md,
    marginBottom: 80, // Espaço para a bottom bar
    // position: 'relative',
    alignItems: 'flex-end', // Alinha o botão à direita da tela
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDisabled,
    letterSpacing: 1,
  },
  score: {
    fontFamily: FONTS.headline,
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    marginBottom: SPACING.sm,
    width: '85%', // Deixa espaço para o FAB
  },
  progressFill: {
    height: '100%',
    width: '84%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textDisabled,
  },
  fab: {
    // position: 'absolute',
    // bottom: -16,
    // right: -16,
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary, // Atualizado para a cor primária (já que o card sumiu)
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});