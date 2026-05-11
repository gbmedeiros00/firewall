import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, StatusBar, SafeAreaView, Platform, Alert, DeviceEventEmitter, Modal, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Shield, Palette, Download, Upload, AlertTriangle, ChevronRight } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../theme';
import ScreenWrapper from '../components/ScreenWrapper';
import PageHeader from '../components/PageHeader';
import CsvMappingModal, { CsvMapping } from '../components/CsvMappingModal';
import { API_URL } from '../config';
import { ShieldFilledIcon } from '../icons';
import ExportBackupModal from '../components/ExportBackupModal';
import InputField from '../components/InputField';
import { AUTO_LOCK_TIMEOUT_KEY, EVENT_AUTO_LOCK_CHANGED } from '../hooks/useAutoLock';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

// --- Interfaces de Componentização ---
interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface SettingItemProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isDestructive?: boolean;
}

// --- Componentes Reutilizáveis Locais ---
const SettingSection = ({ title, icon, children }: SettingSectionProps) => {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  return (
    <View style={s.sectionContainer}>
      <View style={s.sectionHeader}>
        {icon}
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.sectionBody}>
        {children}
      </View>
    </View>
  );
};

const SettingItem = ({ title, subtitle, rightElement, onPress, isDestructive }: SettingItemProps) => {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={s.itemContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={s.itemTextWrap}>
        <Text style={[s.itemTitle, isDestructive && { color: colors.error }]}>{title}</Text>
        {subtitle && <Text style={[s.itemSubtitle, isDestructive && { color: colors.error }]}>{subtitle}</Text>}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </Container>
  );
};

// Propriedades da tela para receber o token
interface SettingsScreenProps {
  token?: string | null;
  onLock?: () => void;
  onLogout?: () => void;
}

// --- Tela Principal ---
export default function SettingsScreen({ token, onLock, onLogout }: SettingsScreenProps) {
  const { mode, setMode, colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  // Estados dos switches
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [decoyEnabled, setDecoyEnabled] = useState(false);

  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Estados para Ativação Segura da Biometria
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('biometrics_enabled').then(val => {
      setBiometricsEnabled(val === 'true');
    });
  }, []);

  const handleToggleBiometrics = async (val: boolean) => {
    if (!val) {
      setBiometricsEnabled(false);
      await SecureStore.setItemAsync('biometrics_enabled', 'false');
      // Segurança Extrema: Removemos o token salvo para destruir qualquer possibilidade de atalho
      await SecureStore.deleteItemAsync('user_token');
      return;
    }

    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert('Indisponível', 'Seu dispositivo não possui sensor biométrico.');
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert('Sem Registros', 'Você precisa cadastrar uma digital ou rosto nas configurações do seu celular primeiro.');
      return;
    }

    setPasswordVerify('');
    setShowPasswordPrompt(true);
  };

  const confirmBiometricEnable = async () => {
    setIsVerifying(true);
    try {
      const email = await SecureStore.getItemAsync('user_email');
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordVerify }),
      });

      if (response.ok) {
        const data = await response.json();
        setBiometricsEnabled(true);
        await SecureStore.setItemAsync('biometrics_enabled', 'true');
        await SecureStore.setItemAsync('user_token', data.token); // Salva o token para uso rápido!
        setShowPasswordPrompt(false);
        Alert.alert('Sucesso', 'Autenticação biométrica ativada com segurança!');
      } else {
        Alert.alert('Erro', 'Senha mestra incorreta.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
    } finally {
      setIsVerifying(false);
    }
  };

  // --- Lógica de Auto-Bloqueio ---
  const [lockTimeout, setLockTimeout] = useState<number>(300000); // 5 min padrão

  useEffect(() => {
    SecureStore.getItemAsync(AUTO_LOCK_TIMEOUT_KEY).then(val => {
      if (val) setLockTimeout(parseInt(val, 10));
    });
  }, []);

  const updateTimer = async (ms: number) => {
    setLockTimeout(ms);
    await SecureStore.setItemAsync(AUTO_LOCK_TIMEOUT_KEY, ms.toString());
    DeviceEventEmitter.emit(EVENT_AUTO_LOCK_CHANGED, ms);
  };

  const handleChangeTimer = () => {
    Alert.alert('Auto-bloqueio', 'Exigir autenticação após inatividade:', [
      { text: 'Imediato (Ao sair)', onPress: () => updateTimer(0) },
      { text: '1 Minuto', onPress: () => updateTimer(60000) },
      { text: '5 Minutos', onPress: () => updateTimer(300000) },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  const formatTimer = (ms: number) => {
    if (ms === 0) return 'Imediato';
    if (ms === 60000) return '1 min';
    if (ms === 300000) return '5 min';
    return `${ms / 60000} min`;
  };

  // Estados da Importação
  const [mappingModalVisible, setMappingModalVisible] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleSelectCsv = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', '*/*'],
        copyToCacheDirectory: true,
      });

      let fileUri = '';
      let fileName = '';
      let fileObj: any = null;

      // Suporte para a API Nova (Expo SDK 48+)
      if ('assets' in result && result.assets && result.assets.length > 0) {
        fileUri = result.assets[0].uri;
        fileName = result.assets[0].name;
        fileObj = result.assets[0];
      } 
      // Suporte para a API Antiga (Expo SDK 47 e inferiores no Expo Go)
      else if ('type' in result && (result as any).type === 'success') {
        fileUri = (result as any).uri;
        fileName = (result as any).name;
        fileObj = { uri: fileUri, name: fileName, mimeType: 'text/csv' };
      } else {
        return; // Usuário cancelou a seleção
      }
        
      const fileString = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' });
      const firstLine = fileString.split('\n')[0];
      
      // Detecta automaticamente se o arquivo usa vírgula ou ponto e vírgula no Frontend
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semicolonCount = (firstLine.match(/;/g) || []).length;
      const delimiter = semicolonCount > commaCount ? ';' : ',';
      
      // Divide as colunas ignorando o delimitador caso esteja dentro de aspas
      const splitRegex = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`);
      const headers = firstLine.split(splitRegex).map(h => h.replace(/["\r]/g, '').trim());
      
      setCsvHeaders(headers);
      setSelectedFile(fileObj);
      setMappingModalVisible(true);
    } catch (err: any) {
      console.error('Erro na importação:', err);
      Alert.alert('Erro', `Não foi possível ler o arquivo.\n\nDetalhe: ${err.message || err}`);
    }
  };

  const handleImportData = async (mapping: CsvMapping) => {
    if (!selectedFile) return;
    setMappingModalVisible(false);

    try {
      const formData = new FormData();
      formData.append('file', { uri: selectedFile.uri, name: selectedFile.name, type: selectedFile.mimeType || 'text/csv' } as any);
      formData.append('mapping', JSON.stringify(mapping));

      const response = await fetch(`${API_URL}/api/vault/import`, { 
        method: 'POST', 
        body: formData, 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (response.ok) {
        Alert.alert('Sucesso', 'Cofre importado e salvo com segurança!');
      } else {
        Alert.alert('Erro', 'Falha ao processar o arquivo no servidor.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar com o servidor para importação.');
    }
  };

  const handleExportData = async (password: string) => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API_URL}/api/vault/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        const base64Data = data.encryptedData;

        // Usar encoding 'base64' instrui o FileSystem a transformar a string em arquivo binário puro
        const fileUri = `${FileSystem.documentDirectory}firewall_backup_${new Date().getTime()}.fwbak`;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: 'base64' });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, { dialogTitle: 'Salvar Backup Seguro do Cofre' });
        } else {
          Alert.alert('Aviso', 'Backup gerado, mas o compartilhamento não é suportado no dispositivo atual.');
        }
        setExportModalVisible(false);
      } else {
        Alert.alert('Erro', 'Falha de validação ou erro interno ao gerar o backup.');
      }
    } catch (err) {
      Alert.alert('Erro de Rede', 'Não foi possível conectar ao servidor para exportar.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : colors.primary} />

      {/* Header Superior Fixo (Padrão da Aplicação) */}
      <View style={s.topHeader}>
        <View style={s.brandRow}>
          <ShieldFilledIcon size={20} color={isDark ? colors.primary : '#FFFFFF'} />
          <Text style={s.topHeaderTitle}>FIREWALL</Text>
        </View>
      </View>

      <View style={s.mainContent}>
        <ScreenWrapper contentContainerStyle={s.scrollContent}>
          <PageHeader title="Configurações" subtitle="Configure seu santuário digital." />
          
        {/* Seção 1: Segurança */}
        <SettingSection title="Segurança" icon={<Shield size={18} color={colors.primary} />}>
          <SettingItem 
            title="Timer de auto-bloqueio" 
            rightElement={
              <View style={s.rowCenter}>
                <Text style={s.valueText}>{formatTimer(lockTimeout)}</Text>
                <ChevronRight size={16} color={colors.placeholder} />
              </View>
            }
            onPress={handleChangeTimer}
          />
          <View style={s.divider} />
          <SettingItem 
            title="Desbloqueio Biométrico" 
            subtitle="Use Touch ID / Face ID"
            rightElement={
              <Switch 
                value={biometricsEnabled} 
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingSection>

        {/* Seção 2: Personalização */}
        <SettingSection title="Personalização" icon={<Palette size={18} color={colors.primary} />}>
          <SettingItem 
            title="Tema do Aplicativo" 
            rightElement={
              <View style={s.themeToggle}>
                <TouchableOpacity 
                  style={[s.themeBtn, mode === 'light' && s.themeBtnActive]}
                  onPress={() => setMode('light')}
                >
                  <Text style={[s.themeBtnText, mode === 'light' && s.themeBtnTextActive]}>Claro</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[s.themeBtn, mode === 'dark' && s.themeBtnActive]}
                  onPress={() => setMode('dark')}
                >
                  <Text style={[s.themeBtnText, mode === 'dark' && s.themeBtnTextActive]}>Escuro</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[s.themeBtn, mode === 'system' && s.themeBtnActive]}
                  onPress={() => setMode('system')}
                >
                  <Text style={[s.themeBtnText, mode === 'system' && s.themeBtnTextActive]}>Sistema</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </SettingSection>

        {/* Seção 3: Dados */}
        <SettingSection title="Dados" icon={<Download size={18} color={colors.primary} />}>
          <SettingItem 
            title="Importar cofre" 
            subtitle="Migrar senhas via arquivo CSV"
            rightElement={<Upload size={16} color={colors.placeholder} />}
            onPress={handleSelectCsv}
          />
          <View style={s.divider} />
          <SettingItem 
            title="Exportar cofre" 
            subtitle="Gerar backup JSON criptografado"
            rightElement={<ChevronRight size={16} color={colors.placeholder} />}
            onPress={() => setExportModalVisible(true)}
          />
        </SettingSection>

        {/* Seção 4: Avançado */}
        {/* <SettingSection title="Avançado (Risco)" icon={<AlertTriangle size={18} color={colors.error} />}>
          <SettingItem 
            title="Cofre de Emergência Falso" 
            subtitle="Permite configurar uma senha alternativa que abre um cofre vazio em caso de coação."
            isDestructive={true}
            rightElement={
              <Switch 
                value={decoyEnabled} 
                onValueChange={setDecoyEnabled}
                trackColor={{ false: colors.surfaceAlt, true: colors.error }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingSection> */}

        {/* Seção 5: Sessão */}
        <SettingSection title="Sessão" icon={<MaterialIcons name="security" size={18} color={colors.primary} />}>
          <SettingItem 
            title="Bloquear Aplicativo" 
            subtitle="Exigir senha para entrar novamente"
            rightElement={<MaterialIcons name="lock" size={16} color={colors.placeholder} />}
            onPress={onLock}
          />
          <View style={s.divider} />
          <SettingItem 
            title="Sair da Conta" 
            subtitle="Encerrar sessão completamente"
            isDestructive={true}
            rightElement={<MaterialIcons name="logout" size={16} color={colors.error} />}
            onPress={onLogout}
          />
        </SettingSection>

          {/* Footer */}

          {/* Modal de Mapeamento do CSV */}
          {selectedFile && (
            <CsvMappingModal
              visible={mappingModalVisible}
              headers={csvHeaders}
              fileName={selectedFile.name}
              onClose={() => setMappingModalVisible(false)}
              onImport={handleImportData}
            />
          )}

          {/* Modal de Exportação / Backup Seguro */}
          <ExportBackupModal
            visible={exportModalVisible}
            isLoading={isExporting}
            onClose={() => setExportModalVisible(false)}
            onExport={handleExportData}
          />

          {/* Modal de Confirmação de Senha para Biometria */}
          <Modal visible={showPasswordPrompt} transparent animationType="fade" onRequestClose={() => setShowPasswordPrompt(false)}>
            <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={s.card}>
                <View style={s.header}>
                  <View>
                    <Text style={s.headerTitle}>Confirmar Identidade</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowPasswordPrompt(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} disabled={isVerifying}>
                    <MaterialIcons name="close" size={24} color={colors.secondary} />
                  </TouchableOpacity>
                </View>

                <Text style={s.instructionText}>
                  Para ativar o desbloqueio biométrico, confirme sua Senha Mestra.
                </Text>

                <InputField
                  label="SENHA MESTRA"
                  placeholder="••••••••••••"
                  value={passwordVerify}
                  onChangeText={setPasswordVerify}
                  secure={true}
                  showToggle={true}
                  visible={showPass}
                  onToggle={() => setShowPass(!showPass)}
                />

                <TouchableOpacity
                  style={[s.primaryBtn, (passwordVerify.length < 6 || isVerifying) && s.primaryBtnDisabled]}
                  onPress={confirmBiometricEnable}
                  activeOpacity={0.8}
                  disabled={passwordVerify.length < 6 || isVerifying}
                >
                  {isVerifying ? <ActivityIndicator color="#FFFFFF" /> : (
                    <><FontAwesome5 name="check" size={16} color="#FFFFFF" /><Text style={s.primaryBtnText}>Confirmar e Ativar</Text></>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          <View style={s.footer}>
            <Text style={s.footerTitle}>FIREWALL ARCHITECTURE V4.0.1</Text>
            <Text style={s.footerHash}>KERNEL HASH: 0x9A4B...F7C1</Text>
          </View>

        </ScreenWrapper>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mainContent: { flex: 1, backgroundColor: colors.background },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
    paddingBottom: 16,
    backgroundColor: isDark ? colors.background : colors.primary,
    borderBottomWidth: isDark ? 1 : 0,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  topHeaderTitle: {
    fontFamily: FONTS.headline,
    fontSize: 16,
    fontWeight: '800',
    color: isDark ? colors.primary : '#FFFFFF',
    letterSpacing: 1.5,
  },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: 100 }, // Mesmo espaçamento do cofre
  
  // Sections
  sectionContainer: { marginBottom: SPACING.xxxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.sm, paddingHorizontal: SPACING.xxl },
  sectionTitle: { fontSize: 13, fontFamily: FONTS.body, fontWeight: '700', color: colors.secondary, textTransform: 'uppercase', letterSpacing: 1 },
  sectionBody: { 
    backgroundColor: colors.surface, 
    borderRadius: RADIUS.lg, 
    marginHorizontal: SPACING.xxl, 
    borderWidth: 1, 
    borderColor: colors.border, 
    ...SHADOWS.card, 
    overflow: 'hidden' 
  },
  
  // Items
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  itemTextWrap: { flex: 1, paddingRight: SPACING.md },
  itemTitle: { fontSize: 16, fontFamily: FONTS.body, fontWeight: '600', color: colors.textPrimary },
  itemSubtitle: { fontSize: 12, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: SPACING.lg },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  valueText: { fontSize: 14, fontFamily: FONTS.body, color: colors.textSecondary, fontWeight: '500' },
  
  // Theme Toggle
  themeToggle: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: RADIUS.full, padding: 2 },
  themeBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: RADIUS.full },
  themeBtnActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  themeBtnText: { fontSize: 12, fontFamily: FONTS.body, color: colors.textSecondary, fontWeight: '600' },
  themeBtnTextActive: { color: colors.primary, fontWeight: '800' },

  // Footer
  footer: { alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xxl },
  footerTitle: { fontSize: 10, fontFamily: FONTS.headline, fontWeight: '800', color: colors.placeholder, letterSpacing: 1.5 },
  footerHash: { fontSize: 9, fontFamily: FONTS.mono, color: colors.placeholder, marginTop: 4 },

  // Modal Styles
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', paddingHorizontal: SPACING.lg },
  card: { backgroundColor: colors.surface, borderRadius: RADIUS.xl, padding: SPACING.xl, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  headerTitle: { fontSize: 18, fontFamily: FONTS.headline, fontWeight: '700', color: colors.primary },
  instructionText: { fontSize: 13, fontFamily: FONTS.body, color: colors.textSecondary, marginBottom: SPACING.xl, lineHeight: 20 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: RADIUS.lg, gap: SPACING.sm, marginTop: SPACING.sm },
  primaryBtnDisabled: { backgroundColor: colors.secondary, opacity: 0.5 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: FONTS.body },
});