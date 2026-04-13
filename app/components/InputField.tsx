import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { EyeIcon, EyeOffIcon } from '../icons';

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
          placeholderTextColor={COLORS.placeholder}
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
              ? <EyeIcon size={20} color={COLORS.secondary} />
              : <EyeOffIcon size={20} color={COLORS.secondary} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const inp = StyleSheet.create({
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
    color: COLORS.secondary,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  wrapFocused: { borderColor: COLORS.tertiary, backgroundColor: COLORS.white },
  wrapError: { borderColor: COLORS.error },
  wrapSuccess: { borderColor: COLORS.success },
  iconLeft: { marginRight: SPACING.sm },
  field: { flex: 1, height: 50, fontSize: 15, fontFamily: FONTS.body, color: COLORS.textPrimary },
  eyeBtn: { paddingLeft: SPACING.sm },
});