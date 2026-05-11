import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FONTS, RADIUS, SPACING } from '../theme';
import SecondaryHeader from '../components/SecondaryHeader';
import InputField from '../components/InputField';
import CategorySelector from '../components/CategorySelector';
import TextArea from '../components/TextArea';
import PasswordGeneratorModal from '../components/PasswordGeneratorModal';
import { getStrength } from '../utils/passwordUtils';
import ScreenWrapper from '../components/ScreenWrapper';
import { API_URL } from '../config';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

const CATEGORIES = ['Trabalho', 'Social', 'Finanças', 'Jogos'];

interface EditCredentialScreenProps {
  token?: string | null;
  credential: any;
  onBack?: () => void;
  onSave?: (updated: any) => void;
}

export default function EditCredentialScreen({ token, credential, onBack, onSave }: EditCredentialScreenProps) {
  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  // Preenche os estados com os dados atuais da credencial
  const [title, setTitle] = useState(credential?.title || '');
  const [username, setUsername] = useState(credential?.username || '');
  const [password, setPassword] = useState(credential?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [url, setUrl] = useState(credential?.url || '');
  const [category, setCategory] = useState(credential?.category || 'Trabalho');
  
  // Lógica para inicializar as notas, suportando o modelo antigo (string) e o novo (array)
  const getInitialNotes = () => {
    let currentNotes = credential?.notes;
    
    // Tenta fazer o parse caso a nota venha como string JSON do backend
    if (typeof currentNotes === 'string') {
      try {
        currentNotes = JSON.parse(currentNotes);
      } catch (e) {
        // Falhou ao fazer o parse, significa que é o formato antigo (texto simples)
      }
    }

    if (Array.isArray(currentNotes) && currentNotes.length > 0) {
      return currentNotes;
    }
    if (typeof currentNotes === 'string' && currentNotes) {
      return [currentNotes];
    }
    return ['']; // Padrão: um campo de nota vazio
  };
  const [notes, setNotes] = useState<string[]>(getInitialNotes());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratorVisible, setIsGeneratorVisible] = useState(false);

  const handleNoteChange = (text: string, index: number) => {
    const newNotes = [...notes];
    newNotes[index] = text;
    setNotes(newNotes);
  };

  const handleAddNote = () => {
    setNotes([...notes, '']);
  };

  const handleDeleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleGeneratePassword = () => {
    setIsGeneratorVisible(true);
  };

  const handleUpdate = async () => {
    if (!title || !password) {
      setError('Título e Senha são obrigatórios.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/credentials/${credential.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, username, password, url, category, 
          // Envia apenas as notas que não estão vazias
          notes: JSON.stringify(notes.filter(note => note.trim() !== '')) 
        }),
      });

      if (response.ok) {
        // Constrói o objeto atualizado para a tela de detalhes exibir instantaneamente
        const updatedCredential = {
          ...credential,
          title,
          username,
          password,
          url,
          category,
          notes: JSON.stringify(notes.filter(note => note.trim() !== '')) // Mantém o formato no retorno
        };
        onSave?.(updatedCredential);
      } else {
        setError('Erro ao atualizar a credencial.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBtn = (
    <TouchableOpacity onPress={handleGeneratePassword} style={s.generateBtn}>
      <FontAwesome5 name="sync-alt" size={10} color={colors.primary} />
      <Text style={s.generateText}>Gerar</Text>
    </TouchableOpacity>
  );

  const strength = getStrength(password);
  const strengthWidth = strength.filled === 0 ? '10%' : `${(strength.filled / 4) * 100}%`;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : colors.primary} />
      
      <SecondaryHeader 
        title="Editar Entrada" 
        onBack={onBack || (() => console.log('Voltar'))} 
      />

      <ScreenWrapper contentContainerStyle={s.content}>
        
        <View style={s.topIconContainer}>
          <View style={s.keyBox}>
            <FontAwesome5 name="edit" size={24} color={colors.primary} />
          </View>
        </View>

        <InputField
          label="TÍTULO"
          placeholder="e.g. Personal Email"
          value={title}
          onChangeText={setTitle}
        />

        <InputField
          label="USUÁRIO"
          placeholder="username@example.com"
          value={username}
          onChangeText={setUsername}
        />

        <InputField
          label="SENHA"
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
          secure={true}
          showToggle={true}
          visible={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          rightComponent={generateBtn}
        />

        {password.length > 0 && (
          <View style={s.strengthRow}>
            <View style={s.strengthTrack}>
              <View style={[s.strengthFill, { width: strengthWidth as any, backgroundColor: strength.color }]} />
            </View>
            <Text style={[s.strengthText, { color: strength.color }]}>{strength.label.toUpperCase()}</Text>
          </View>
        )}

        <InputField
          label="URL"
          placeholder="https://www.google.com"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
        />

        <CategorySelector 
          categories={CATEGORIES} 
          selected={category} 
          onSelect={setCategory} 
        />

        {/* Seção de Notas Múltiplas */}
        <Text style={s.label}>NOTAS</Text>
        {notes.map((note, index) => (
          <View key={index} style={s.noteContainer}>
            <View style={{ flex: 1 }}>
              <TextArea
                label=""
                placeholder={`Nota ${index + 1}...`}
                value={note}
                onChangeText={(text) => handleNoteChange(text, index)}
              />
            </View>
            <TouchableOpacity onPress={() => handleDeleteNote(index)} style={s.deleteNoteBtn}>
              <FontAwesome5 name="trash-alt" size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={handleAddNote} style={s.addNoteBtn}>
          <FontAwesome5 name="plus" size={12} color={colors.primary} />
          <Text style={s.addNoteText}>Adicionar Nota</Text>
        </TouchableOpacity>
        {/* --- Fim da Seção de Notas --- */}
        
        {error ? <Text style={s.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[s.saveButton, isLoading && s.saveButtonDisabled]} 
          onPress={handleUpdate} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={s.saveButtonText}>Atualizar</Text>
          )}
        </TouchableOpacity>

        <Text style={s.footerText}>CRIPTOGRAFADO COM PADRÃO AES-256 BITS</Text>

        {/* Respiro final garantido */}
        <View style={s.bottomSpacer} />

      </ScreenWrapper>

      <PasswordGeneratorModal
        visible={isGeneratorVisible}
        onClose={() => setIsGeneratorVisible(false)}
        onApply={(generatedPassword) => {
          setPassword(generatedPassword);
          setShowPassword(true);
        }}
      />
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { 
    paddingHorizontal: SPACING.xl, 
    paddingTop: SPACING.xl,
    paddingBottom: 20 
  },
  topIconContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  keyBox: {
    width: 60, height: 60, backgroundColor: colors.surfaceAlt, borderRadius: RADIUS.md,
    justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
    elevation: 4, borderWidth: 6, borderColor: colors.background, 
  },
  generateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  generateText: { color: colors.primary, fontSize: 11, fontWeight: '700', fontFamily: FONTS.body },
  label: {
    fontSize: 10, fontFamily: FONTS.body, fontWeight: '700', color: colors.secondary,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: -SPACING.md, marginBottom: SPACING.lg },
  strengthTrack: { flex: 1, height: 4, backgroundColor: colors.surfaceAlt, borderRadius: 2 },
  strengthFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  strengthText: { marginLeft: SPACING.sm, fontSize: 10, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  deleteNoteBtn: {
    padding: SPACING.sm,
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  addNoteText: {
    color: colors.primary,
    fontFamily: FONTS.body,
    fontWeight: '700',
  },
  errorText: { color: colors.error, fontSize: 12, fontFamily: FONTS.body, textAlign: 'center', marginTop: SPACING.md },
  saveButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: RADIUS.md, alignItems: 'center', marginTop: SPACING.lg, marginBottom: SPACING.md },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', fontFamily: FONTS.body },
  footerText: { textAlign: 'center', fontSize: 9, color: colors.placeholder, fontFamily: FONTS.body, letterSpacing: 0.5 },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 60 : 100,
  },
});