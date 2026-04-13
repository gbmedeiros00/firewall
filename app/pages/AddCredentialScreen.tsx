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

interface AddCredentialScreenProps {
  token?: string | null;
  onBack?: () => void;
}

export default function AddCredentialScreen({ token, onBack }: AddCredentialScreenProps) {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Trabalho');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePassword = () => {
    // Gera uma senha aleatória ultra segura de 16 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';
    let generated = '';
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true); // Exibe a senha recém-gerada para o usuário poder copiar/ver
  };

  const handleSave = async () => {
    if (!title || !password) {
      setError('Título e Senha são obrigatórios.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const API_URL = 'http://10.243.35.56:8080';
      const response = await fetch(`${API_URL}/api/credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          username,
          password,
          url,
          category,
          notes
        }),
      });

      if (response.ok) {
        onBack?.(); // Retorna para o cofre e recarrega a lista atualizada!
      } else {
        setError('Erro ao salvar a credencial.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Botão "Gerar" que vai entrar na propriedade rightComponent do InputField
  const generateBtn = (
    <TouchableOpacity onPress={handleGeneratePassword} style={s.generateBtn}>
      <FontAwesome5 name="sync-alt" size={10} color={COLORS.primary} />
      <Text style={s.generateText}>Gerar</Text>
    </TouchableOpacity>
  );

  // Calcula a força da senha digitada/gerada usando a nossa utilidade padrão
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
        title="Adicionar Entrada" 
        onBack={onBack || (() => console.log('Voltar'))} 
      />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Ícone Superior (Caixa Cinza com Chave) */}
        <View style={s.topIconContainer}>
          <View style={s.keyBox}>
            <FontAwesome5 name="key" size={24} color={COLORS.primary} />
          </View>
        </View>

        {/* Formulário usando o seu InputField */}
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
          rightComponent={generateBtn} // Usando a propriedade genial que você criou!
        />

        {/* Barra de Força da Senha */}
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

        {/* Botão Salvar e Rodapé */}
        <TouchableOpacity 
          style={[s.saveButton, isLoading && s.saveButtonDisabled]} 
          onPress={handleSave} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={s.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>

        <Text style={s.footerText}>CRIPTOGRAFADO COM PADRÃO AES-256 BITS</Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 120, // Espaço extra para o Scroll com teclado
  },
  topIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  keyBox: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    // Fundo cinza ao redor da caixa branca
    borderWidth: 10,
    borderColor: COLORS.surface, 
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  generateText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -SPACING.md, // Puxa a barra para perto do Input
    marginBottom: SPACING.lg,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 2,
  },
  strengthFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  strengthText: {
    marginLeft: SPACING.sm,
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: FONTS.body,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 9,
    color: COLORS.placeholder,
    fontFamily: FONTS.body,
    letterSpacing: 0.5,
  },
});