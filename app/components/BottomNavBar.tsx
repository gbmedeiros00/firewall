import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Lock, Shield, Settings } from 'lucide-react-native';
import { FONTS, SPACING } from '../theme';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

export type Tab = 'vault' | 'audit' | 'settings';

interface BottomNavBarProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

export default function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const tabs = [
    { key: 'vault', label: 'Cofre', Icon: Lock },
    { key: 'audit', label: 'Auditoria', Icon: Shield },
    { key: 'settings', label: 'Ajustes', Icon: Settings },
  ] as const;

  return (
    <View style={s.container}>
      {tabs.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;
        // Ícones em #777777 quando inativos e #1F3B64 (Primary) quando ativos.
        const iconColor = isActive ? colors.primary : colors.neutral;
        
        return (
          <TouchableOpacity
            key={key}
            style={s.tab}
            onPress={() => onTabPress(key)}
            activeOpacity={0.7}
          >
            <Icon 
              size={24} 
              color={iconColor} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text style={[s.label, isActive && s.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background, // Fundo #1A1A1A no Dark Mode
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 32 : SPACING.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    gap: 4,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: colors.neutral,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});