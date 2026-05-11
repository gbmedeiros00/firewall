import React, { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../theme';
import { EyeIcon, EyeOffIcon } from '../icons';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

export interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  showToggle?: boolean;
  visible?: boolean;
  onToggle?: () => void;
  icon?: React.ReactNode;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
  success?: boolean;
  keyboardType?: 'default' | 'email-address' | 'url';
  autoComplete?: 'email' | 'password' | 'off';
  rightComponent?: React.ReactNode;
}

export default function InputField({
  label, placeholder, value, onChangeText,
  secure, showToggle, visible, onToggle,
  icon, focused, onFocus, onBlur,
  error, success, keyboardType, autoComplete,
  rightComponent
}: InputFieldProps) {
  const { colors, isDark } = useTheme();
  const inp = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={inp.group}>
      <View style={inp.labelRow}>
        <Text style={inp.label}>{label}</Text>
        {rightComponent}
      </View>
      <View style={[
        inp.wrap,
        focused && inp.wrapFocused,
        error && inp.wrapError,
        success && inp.wrapSuccess,
      ]}>
        {icon && <View style={inp.iconLeft}>{icon}</View>}
        <TextInput
          style={inp.field}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !visible}
          autoCapitalize="none"
          keyboardType={keyboardType ?? 'default'}
          autoComplete={autoComplete ?? 'off'}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showToggle && (
          <TouchableOpacity
            style={inp.eyeBtn}
            onPress={onToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {visible
              ? <EyeIcon size={20} color={colors.secondary} />
              : <EyeOffIcon size={20} color={colors.secondary} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  group: { marginBottom: SPACING.lg },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.secondary,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: SPACING.md,
  },
  wrapFocused: { borderColor: colors.tertiary, backgroundColor: colors.surface },
  wrapError: { borderColor: colors.error },
  wrapSuccess: { borderColor: colors.success },
  iconLeft: { marginRight: SPACING.sm },
  field: { flex: 1, height: 50, fontSize: 15, fontFamily: FONTS.body, color: colors.textPrimary },
  eyeBtn: { paddingLeft: SPACING.sm },
});