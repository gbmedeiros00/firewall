import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

export interface CsvMapping {
  title: string;
  username: string;
  password: string;
  url: string;
}

interface CsvMappingModalProps {
  visible: boolean;
  headers: string[];
  fileName: string;
  onClose: () => void;
  onImport: (mapping: CsvMapping) => void;
}

export default function CsvMappingModal({ visible, headers, fileName, onClose, onImport }: CsvMappingModalProps) {
  const [mapping, setMapping] = useState<CsvMapping>({
    title: '',
    username: '',
    password: '',
    url: '',
  });

  const handleSelect = (field: keyof CsvMapping, header: string) => {
    setMapping(prev => ({ ...prev, [field]: prev[field] === header ? '' : header }));
  };

  const isReady = mapping.title !== '' && mapping.password !== '';

  const renderMappingSection = (label: string, field: keyof CsvMapping, required: boolean = false) => (
    <View style={s.mappingSection}>
      <Text style={s.sectionLabel}>{label} {required && <Text style={s.required}>*</Text>}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsContainer}>
        {headers.map(header => {
          const isSelected = mapping[field] === header;
          return (
            <TouchableOpacity
              key={header}
              style={[s.chip, isSelected && s.chipSelected]}
              onPress={() => handleSelect(field, header)}
              activeOpacity={0.7}
            >
              <Text style={[s.chipText, isSelected && s.chipTextSelected]}>{header}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.card}>
          
          <View style={s.header}>
            <View>
              <Text style={s.headerTitle}>Mapear Colunas</Text>
              <Text style={s.headerSubtitle}>Arquivo: {fileName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={s.instruction}>
            Selecione qual coluna do seu arquivo CSV corresponde a cada campo do cofre:
          </Text>

          <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
            {renderMappingSection('TÍTULO / NOME DA CONTA', 'title', true)}
            {renderMappingSection('USUÁRIO / E-MAIL', 'username')}
            {renderMappingSection('SENHA', 'password', true)}
            {renderMappingSection('URL / SITE', 'url')}
          </ScrollView>

          <View style={s.actionsContainer}>
            <TouchableOpacity 
              style={[s.primaryBtn, !isReady && s.primaryBtnDisabled]} 
              onPress={() => isReady && onImport(mapping)} 
              activeOpacity={0.8}
              disabled={!isReady}
            >
              <FontAwesome5 name="file-import" size={16} color={COLORS.white} />
              <Text style={s.primaryBtnText}>Importar Dados Seguros</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl, paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    maxHeight: '85%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  headerTitle: { fontSize: 18, fontFamily: FONTS.headline, fontWeight: '700', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, fontFamily: FONTS.body, color: COLORS.textSecondary, marginTop: 2 },
  instruction: { fontSize: 13, fontFamily: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xl, lineHeight: 20 },
  scrollArea: { marginBottom: SPACING.lg },
  mappingSection: { marginBottom: SPACING.lg },
  sectionLabel: { 
    fontSize: 11, fontFamily: FONTS.body, fontWeight: '700', 
    color: COLORS.secondary, letterSpacing: 0.5, marginBottom: SPACING.sm 
  },
  required: { color: COLORS.error },
  chipsContainer: { gap: SPACING.sm, paddingRight: SPACING.xl },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: RADIUS.md, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  chipText: { fontSize: 13, fontFamily: FONTS.body, color: COLORS.textSecondary, fontWeight: '500' },
  chipTextSelected: { color: COLORS.white, fontWeight: '700' },
  actionsContainer: { paddingTop: SPACING.sm },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.lg, gap: SPACING.sm,
  },
  primaryBtnDisabled: { backgroundColor: COLORS.secondary, opacity: 0.5 },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700', fontFamily: FONTS.body },
});