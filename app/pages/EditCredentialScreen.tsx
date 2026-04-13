import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import SecondaryHeader from '../components/SecondaryHeader';
import InputField from '../components/InputField';
import CategorySelector from '../components/CategorySelector';
import TextArea from '../components/TextArea';
import { getStrength } from '../utils/passwordUtils';

const CATEGORIES = ['Trabalho', 'Social', 'Finanças', 'Jogos'];

interface EditCredentialScreenProps {
  token?: string | null;
  credential: any;
  onBack?: () => void;
  onSave?: (updated: any) => void;
}

export default function EditCredentialScreen({ token, credential, onBack, onSave }: EditCredentialScreenProps) {
  // Preenche os estados com os dados atuais da credencial
  const [title, setTitle] = useState(credential?.title || '');
  const [username, setUsername] = useState(credential?.username || '');
  const [password, setPassword] = useState(credential?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [url, setUrl] = useState(credential?.url || '');
  const [category, setCategory] = useState(credential?.category || 'Trabalho');
  const [notes, setNotes] = useState(credential?.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';
    let generated = '';
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const handleUpdate = async () => {
    if (!title || !password) {
      setError('Título e Senha são obrigatórios.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const API_URL = 'http://10.243.35.56:8080';
      const response = await fetch(`${API_URL}/api/credentials/${credential.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, username, password, url, category, notes }),
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
          notes
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
      <FontAwesome5 name="sync-alt" size={10} color={COLORS.primary} />
      <Text style={s.generateText}>Gerar</Text>
    </TouchableOpacity>
  );

  const strength = getStrength(password);
  const strengthWidth = strength.filled === 0 ? '10%' : `${(strength.filled / 4) * 100}%`;

  return (
    <KeyboardAvoidingView 
      style={s.root} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <SecondaryHeader 
        title="Editar Entrada" 
        onBack={onBack || (() => console.log('Voltar'))} 
      />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <View style={s.topIconContainer}>
          <View style={s.keyBox}>
            <FontAwesome5 name="edit" size={24} color={COLORS.primary} />
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

        <TextArea
          label="NOTAS"
          placeholder="Adicione detalhes adicionais..."
          value={notes}
          onChangeText={setNotes}
        />

        {error ? <Text style={s.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[s.saveButton, isLoading && s.saveButtonDisabled]} 
          onPress={handleUpdate} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={s.saveButtonText}>Atualizar</Text>
          )}
        </TouchableOpacity>

        <Text style={s.footerText}>CRIPTOGRAFADO COM PADRÃO AES-256 BITS</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.xl, paddingBottom: 120 }, // Espaço extra
  topIconContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  keyBox: {
    width: 60, height: 60, backgroundColor: COLORS.white, borderRadius: RADIUS.md,
    justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
    elevation: 4, borderWidth: 10, borderColor: COLORS.surface, 
  },
  generateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  generateText: { color: COLORS.primary, fontSize: 11, fontWeight: '700', fontFamily: FONTS.body },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: -SPACING.md, marginBottom: SPACING.lg },
  strengthTrack: { flex: 1, height: 4, backgroundColor: COLORS.surfaceAlt, borderRadius: 2 },
  strengthFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  strengthText: { marginLeft: SPACING.sm, fontSize: 10, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  errorText: { color: COLORS.error, fontSize: 12, fontFamily: FONTS.body, textAlign: 'center', marginTop: SPACING.md },
  saveButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md, alignItems: 'center', marginTop: SPACING.lg, marginBottom: SPACING.md },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700', fontFamily: FONTS.body },
  footerText: { textAlign: 'center', fontSize: 9, color: COLORS.placeholder, fontFamily: FONTS.body, letterSpacing: 0.5 },
});