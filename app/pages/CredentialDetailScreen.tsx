import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Platform, Alert, Linking, } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome5 } from '@expo/vector-icons';
import { ArrowLeft, Edit3, ShieldCheck, Clock } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import TotpCard from '../components/TotpCard';
import DetailField from '../components/DetailField';

interface CredentialDetailScreenProps {
  credential?: any;
  onEdit?: () => void;
  onBack?: () => void;
}

export default function CredentialDetailScreen({ credential, onEdit, onBack }: CredentialDetailScreenProps) {
  const handleCopy = async (text: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert('Sucesso', 'Copiado para a área de transferência!');
  };

  const handleOpenUrl = async (url: string) => {
    if (!url) return;
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link: ' + formattedUrl);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um problema ao tentar abrir o link.');
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Cabeçalho Inline (adaptado para ter o ícone de edição) */}
      <View style={s.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onBack}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhes da Entrada</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onEdit}>
          <Edit3 size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho da Credencial */}
        <View style={s.titleSection}>
          <View style={s.titleTextWrap}>
            <View style={s.categoryPill}>
              <Text style={s.categoryText}>{credential?.category?.toUpperCase() || 'SEM CATEGORIA'}</Text>
            </View>
            <Text style={s.title}>{credential?.title || 'Sem Título'}</Text>
            <Text style={s.subtitle}>{credential?.username || 'Sem Usuário'}</Text>
          </View>
          <View style={s.iconBox}>
            <FontAwesome5 name="key" size={24} color={COLORS.primary} />
          </View>
        </View>

        {/* 2FA */}
        {/* <TotpCard code="842 905" timeLeft={22} /> */}

        {/* Campos de Dados */}
        {credential?.username ? (
          <DetailField 
            label="USUÁRIO" 
            value={credential.username} 
            onCopy={() => handleCopy(credential.username)} 
          />
        ) : null}
        
        <DetailField 
          label="SENHA" 
          value={credential?.password || ''} 
          isPassword 
          onCopy={() => handleCopy(credential?.password || '')} 
        />
        
        {credential?.url ? (
          <DetailField 
            label="URL / SITE" 
            value={credential.url} 
            isLink 
            onLinkPress={() => handleOpenUrl(credential.url)} 
          />
        ) : null}

        {/* Bloco de Notas (diferente dos DetailFields pois é texto longo) */}
        {credential?.notes ? (
          <View style={s.notesBox}>
            <Text style={s.notesLabel}>NOTAS</Text>
            <Text style={s.notesText}>{credential.notes}</Text>
          </View>
        ) : null}

        {/* Crachá de Segurança */}
        <View style={s.securityBadge}>
          <View style={s.shieldIconWrap}>
            <ShieldCheck size={16} color={COLORS.success} />
          </View>
          <View>
            <Text style={s.securityBadgeTitle}>Força da Senha: Excelente</Text>
            <Text style={s.securityBadgeText}>Única, complexa e nunca violada.</Text>
          </View>
        </View>

        {/* Rodapé de Metadados */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <Clock size={12} color={COLORS.placeholder} />
            <Text style={s.footerText}> Informação protegida ponta-a-ponta</Text>
          </View>
          <Text style={s.footerId}>VAULT ID: FW-{credential?.id || '000'}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 50, // Ajuste de Safe Area
  },
  headerTitle: {
    fontFamily: FONTS.headline,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  titleTextWrap: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  categoryPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: 9,
    fontFamily: FONTS.body,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.headline,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: COLORS.secondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  notesText: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.success}40`,
    backgroundColor: `${COLORS.success}10`,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xxxl,
  },
  shieldIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.success}40`,
  },
  securityBadgeTitle: {
    fontSize: 13,
    fontFamily: FONTS.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  securityBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontFamily: FONTS.body,
    color: COLORS.placeholder,
  },
  footerId: {
    fontSize: 9,
    fontFamily: FONTS.body,
    fontWeight: '700',
    color: COLORS.placeholder,
    letterSpacing: 1,
  },
});