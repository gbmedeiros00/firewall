import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Switch, Platform, KeyboardAvoidingView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { FONTS, RADIUS, SPACING } from '../theme';
import { usePasswordGenerator } from '../hooks/usePasswordGenerator';
import { getStrength } from '../utils/passwordUtils';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface PasswordGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (password: string) => void;
}

export default function PasswordGeneratorModal({ visible, onClose, onApply }: PasswordGeneratorModalProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const { password, setPassword, options, updateOption, generatePassword } = usePasswordGenerator();
  const [isCopied, setIsCopied] = useState(false);

  // Atualiza a força da senha em tempo real com base no que está digitado
  const strength = getStrength(password);
  const strengthWidth = strength.filled === 0 ? '10%' : `${(strength.filled / 4) * 100}%`;
  // O utilitário já deve cuidar da cor (laranja/verde) mas garantimos visualmente

  const handleCopy = async () => {
    await Clipboard.setStringAsync(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApply = () => {
    onApply?.(password);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.card}>
          
          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>Gerador de Senhas</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={24} color={colors.neutral} />
            </TouchableOpacity>
          </View>

          {/* Password Display */}
          <View style={s.passwordContainer}>
            <TextInput
              style={s.passwordInput}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
          </View>

          {/* Health Indicator */}
          <View style={s.strengthContainer}>
            <View style={s.strengthTrack}>
              <View style={[s.strengthFill, { width: strengthWidth as any, backgroundColor: strength.color }]} />
            </View>
            <Text style={[s.strengthText, { color: strength.color }]}>
              {strength.label.toUpperCase()}
            </Text>
          </View>

          {/* Length Slider */}
          <View style={s.sliderContainer}>
            <View style={s.sliderHeader}>
              <Text style={s.settingLabel}>Comprimento</Text>
              <Text style={s.lengthValue}>{options.length}</Text>
            </View>
            <Slider
              style={s.slider}
              minimumValue={8}
              maximumValue={64}
              step={1}
              value={options.length}
              onValueChange={(val) => updateOption('length', val)}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceAlt}
              thumbTintColor={Platform.OS === 'android' ? colors.primary : undefined}
            />
          </View>

          {/* Toggles */}
          <View style={s.togglesContainer}>
            <View style={s.toggleRow}>
              <Text style={s.settingLabel}>Letras Maiúsculas</Text>
              <Switch
                value={options.upper}
                onValueChange={(val) => updateOption('upper', val)}
                trackColor={{ false: colors.surfaceAlt, true: `${colors.primary}80` }}
                thumbColor={options.upper ? colors.primary : colors.placeholder}
              />
            </View>
            
            <View style={s.toggleRow}>
              <Text style={s.settingLabel}>Números</Text>
              <Switch
                value={options.numbers}
                onValueChange={(val) => updateOption('numbers', val)}
                trackColor={{ false: colors.surfaceAlt, true: `${colors.primary}80` }}
                thumbColor={options.numbers ? colors.primary : colors.placeholder}
              />
            </View>

            <View style={s.toggleRow}>
              <Text style={s.settingLabel}>Símbolos Especiais</Text>
              <Switch
                value={options.symbols}
                onValueChange={(val) => updateOption('symbols', val)}
                trackColor={{ false: colors.surfaceAlt, true: `${colors.primary}80` }}
                thumbColor={options.symbols ? colors.primary : colors.placeholder}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={s.actionsContainer}>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => generatePassword()} activeOpacity={0.7}>
              <FontAwesome5 name="sync-alt" size={16} color={colors.primary} />
              <Text style={s.secondaryBtnText}>Regerar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[s.primaryBtn, isCopied && s.copiedBtn]} onPress={handleCopy} activeOpacity={0.8}>
              <FontAwesome5 name={isCopied ? "check" : "copy"} size={16} color="#FFFFFF" />
              <Text style={s.primaryBtnText}>{isCopied ? 'Copiado!' : 'Copiar'}</Text>
            </TouchableOpacity>
          </View>

          {/* Optional Apply Button */}
          {onApply && (
            <TouchableOpacity style={s.applyBtn} onPress={handleApply}>
              <Text style={s.applyBtnText}>Usar Senha</Text>
            </TouchableOpacity>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.background, // Fundo principal da modal (#1A1A1A no Dark)
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: { fontSize: 18, fontFamily: FONTS.headline, fontWeight: '700', color: colors.textPrimary },
  passwordContainer: {
    backgroundColor: colors.surface, // Bloco elevado com fundo #1F1F1F
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  passwordInput: {
    fontSize: 20,
    fontFamily: FONTS.mono,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  strengthContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl },
  strengthTrack: { flex: 1, height: 4, backgroundColor: colors.surfaceAlt, borderRadius: 2 },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthText: { marginLeft: SPACING.sm, fontSize: 11, fontWeight: '800', fontFamily: FONTS.body, letterSpacing: 0.5 },
  sliderContainer: { marginBottom: SPACING.lg },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  settingLabel: { fontSize: 14, fontFamily: FONTS.body, color: colors.textPrimary, fontWeight: '600' },
  lengthValue: { fontSize: 16, fontFamily: FONTS.headline, fontWeight: '700', color: colors.primary },
  slider: { width: '100%', height: 40 },
  togglesContainer: { marginBottom: SPACING.xl },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  actionsContainer: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  secondaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, paddingVertical: 14, borderRadius: RADIUS.md, gap: SPACING.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.primary, fontSize: 15, fontWeight: '700', fontFamily: FONTS.body },
  primaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: RADIUS.md, gap: SPACING.sm,
  },
  copiedBtn: {
    backgroundColor: colors.success,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: FONTS.body },
  applyBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  applyBtnText: {
    color: colors.primary, fontSize: 15, fontWeight: '800', fontFamily: FONTS.body,
  },
});