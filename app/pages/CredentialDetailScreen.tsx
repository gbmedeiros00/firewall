import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Platform, Alert, Linking, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome5 } from '@expo/vector-icons';
import { ArrowLeft, Edit3, Clock, Eye, EyeOff, Trash2 } from 'lucide-react-native';
import { FONTS, RADIUS, SPACING } from '../theme';
import TotpCard from '../components/TotpCard';
import DetailField from '../components/DetailField';
import { API_URL } from '../config';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface CredentialDetailScreenProps {
  token?: string | null;
  credential?: any;
  onEdit?: () => void;
  onBack?: () => void;
  onDeleteSuccess?: () => void;
}

export default function CredentialDetailScreen({ token, credential, onEdit, onBack, onDeleteSuccess }: CredentialDetailScreenProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(true);

  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  useEffect(() => {
    if (credential?.id && token) {
      fetchAudit();
    }
  }, [credential, token]);

  const fetchAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch(`${API_URL}/api/credentials/${credential.id}/audit`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setAuditResult(await response.json());
    } catch (e) {
      console.log('Falha na auditoria', e);
    } finally {
      setIsAuditing(false);
    }
  };

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

  const handleDelete = () => {
    Alert.alert(
      'Excluir Credencial',
      'Tem certeza que deseja excluir esta credencial permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/credentials/${credential?.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                onDeleteSuccess?.();
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a credencial.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Falha na conexão com o servidor.');
            }
          }
        }
      ]
    );
  };

  // Tenta processar o campo de notas que pode estar como JSON String vindo do banco
  let displayNotes = credential?.notes;
  if (typeof displayNotes === 'string') {
    try {
      const parsed = JSON.parse(displayNotes);
      if (Array.isArray(parsed)) {
        displayNotes = parsed;
      }
    } catch (e) {
      // Mantém como string caso não seja um JSON (notas antigas)
    }
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : colors.primary} />
      
      {/* Cabeçalho Inline (adaptado para ter o ícone de edição) */}
      <View style={s.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onBack}>
          <ArrowLeft size={24} color={isDark ? colors.textPrimary : '#FFFFFF'} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhes da Entrada</Text>
        <View style={s.headerActions}>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleDelete}>
            <Trash2 size={20} color={isDark ? colors.textPrimary : '#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onEdit}>
            <Edit3 size={20} color={isDark ? colors.textPrimary : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
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
            <FontAwesome5 name="key" size={24} color={colors.primary} />
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
        {displayNotes && Array.isArray(displayNotes) && displayNotes.length > 0 ? (
          <View style={s.notesContainer}>
            <View style={s.notesHeader}>
              <Text style={s.notesLabel}>NOTAS</Text>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setShowNotes(!showNotes)}>
                {showNotes ? <EyeOff size={16} color={colors.neutral} /> : <Eye size={16} color={colors.neutral} />}
              </TouchableOpacity>
            </View>
            {displayNotes.map((note, index) => (
              <View key={index} style={s.notesBox}>
                <Text style={s.noteItem}>{showNotes ? note : '••••••••••••••••••••••••'}</Text>
              </View>
            ))}
          </View>
        // Fallback para dados antigos que podem ser uma string
        ) : displayNotes && typeof displayNotes === 'string' ? (
          <View style={s.notesContainer}>
            <View style={s.notesHeader}>
              <Text style={s.notesLabel}>NOTAS</Text>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setShowNotes(!showNotes)}>
                {showNotes ? <EyeOff size={16} color={colors.neutral} /> : <Eye size={16} color={colors.neutral} />}
              </TouchableOpacity>
            </View>
            <View style={s.notesBox}>
              <Text style={s.noteItem}>{showNotes ? displayNotes : '••••••••••••••••••••••••'}</Text>
            </View>
          </View>
        ) : null}

        {/* Histórico da Credencial */}
        <View style={s.auditSection}>
          <Text style={s.auditHeader}>HISTÓRICO DA CREDENCIAL</Text>
          
          {isAuditing ? (
            <View style={s.auditLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={s.auditLoadingText}>Carregando histórico...</Text>
            </View>
          ) : auditResult ? (
            <View style={s.auditCards}>
              <View style={[s.auditCard, s.auditCardInfo]}>
                <Clock size={20} color={colors.neutral} />
                <View style={s.auditCardTextWrap}>
                  <Text style={s.auditCardTitleInfo}>Data de Criação</Text>
                  <Text style={s.auditCardDesc}>{auditResult.createdAt}</Text>
                </View>
              </View>
              
              <View style={[s.auditCard, s.auditCardInfo]}>
                <Edit3 size={20} color={colors.neutral} />
                <View style={s.auditCardTextWrap}>
                  <Text style={s.auditCardTitleInfo}>Última Modificação</Text>
                  <Text style={s.auditCardDesc}>{auditResult.updatedAt}</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* Rodapé de Metadados */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <Clock size={12} color={colors.placeholder} />
            <Text style={s.footerText}> Informação protegida ponta-a-ponta</Text>
          </View>
          <Text style={s.footerId}>VAULT ID: FW-{credential?.id || '000'}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: isDark ? colors.background : colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 50, // Ajuste de Safe Area
    borderBottomWidth: isDark ? 1 : 0,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: FONTS.headline,
    fontSize: 16,
    fontWeight: '700',
    color: isDark ? colors.textPrimary : '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 80,
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
    backgroundColor: colors.surfaceAlt,
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
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.headline,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesContainer: {
    marginBottom: SPACING.lg,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  notesBox: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm, // Espaçamento entre cada caixa de nota
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  noteItem: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  auditSection: {
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.md,
  },
  auditHeader: {
    fontSize: 10, fontWeight: '700', fontFamily: FONTS.body, color: colors.secondary, letterSpacing: 1, marginBottom: SPACING.md,
  },
  auditLoading: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: colors.surface, padding: SPACING.md, borderRadius: RADIUS.md,
  },
  auditLoadingText: {
    fontSize: 12, fontFamily: FONTS.body, color: colors.textSecondary,
  },
  auditCards: { gap: SPACING.md },
  auditCard: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1,
  },
  auditCardInfo: { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  auditCardTextWrap: { marginLeft: SPACING.md, flex: 1 },
  auditCardTitleInfo: { fontSize: 13, fontFamily: FONTS.body, fontWeight: '700', color: colors.textPrimary },
  auditCardDesc: { fontSize: 11, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: 2, lineHeight: 16 },
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
    color: colors.placeholder,
  },
  footerId: {
    fontSize: 9,
    fontFamily: FONTS.body,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 1,
  },
});