import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import InputField from './InputField';

interface ExportBackupModalProps {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onExport: (password: string) => void;
}

export default function ExportBackupModal({ visible, isLoading, onClose, onExport }: ExportBackupModalProps) {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleExport = () => {
    if (password.length >= 6) {
      onExport(password);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.card}>
          <View style={s.header}>
            <View>
              <Text style={s.headerTitle}>Exportar Cofre Seguro</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} disabled={isLoading}>
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <View style={s.warningBox}>
            <FontAwesome5 name="exclamation-triangle" size={16} color={COLORS.error} />
            <Text style={s.warningText}>
              O arquivo gerado será um binário criptografado em AES-256. Ninguém, nem mesmo a Firewall, poderá abri-lo sem esta senha.
            </Text>
          </View>

          <InputField
            label="SENHA DE CRIPTOGRAFIA (MESTRA)"
            placeholder="Confirme sua senha mestra..."
            value={password}
            onChangeText={setPassword}
            secure={true}
            showToggle={true}
            visible={showPass}
            onToggle={() => setShowPass(!showPass)}
          />

          <TouchableOpacity
            style={[s.primaryBtn, (password.length < 6 || isLoading) && s.primaryBtnDisabled]}
            onPress={handleExport}
            activeOpacity={0.8}
            disabled={password.length < 6 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <FontAwesome5 name="lock" size={16} color={COLORS.white} />
                <Text style={s.primaryBtnText}>Gerar Backup Criptografado</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', paddingHorizontal: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  headerTitle: { fontSize: 18, fontFamily: FONTS.headline, fontWeight: '700', color: COLORS.primary },
  warningBox: { flexDirection: 'row', backgroundColor: `${COLORS.error}15`, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.xl, alignItems: 'center', gap: SPACING.sm, borderWidth: 1, borderColor: `${COLORS.error}30` },
  warningText: { flex: 1, fontSize: 12, fontFamily: FONTS.body, color: COLORS.error, lineHeight: 18 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.lg, gap: SPACING.sm, marginTop: SPACING.sm,
  },
  primaryBtnDisabled: { backgroundColor: COLORS.secondary, opacity: 0.5 },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700', fontFamily: FONTS.body },
});