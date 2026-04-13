import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import InputField from '../components/InputField';
import VaultItemCard from '../components/VaultItemCard';
import { Search, Plus } from 'lucide-react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; // Keep FontAwesome5 for other icons if needed
import { ShieldFilledIcon } from '../icons'; // Import the ShieldFilledIcon

interface VaultHomeScreenProps {
  token?: string | null;
  onLogout?: () => void;
  onLock?: () => void;
  onNavigateToAdd?: () => void;
  onNavigateToDetail?: (credential: any) => void;
}

export default function VaultHomeScreen({ token, onLogout, onLock, onNavigateToAdd, onNavigateToDetail }: VaultHomeScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const CATEGORIES = ['Todos', 'Trabalho', 'Social', 'Finanças', 'Jogos'];

  useEffect(() => {
    if (token) {
      fetchCredentials();
    } else {
      setCredentials([]);
      setIsLoading(false);
    }
  }, [token]);

  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
      const API_URL = 'http://10.243.35.56:8080';
      const response = await fetch(`${API_URL}/api/credentials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCredentials(data);
      } else {
        setCredentials([]);
      }
    } catch (error) {
      setCredentials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = credentials.filter(item => {
    const title = item.title || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Superior Fixo */}
      <View style={s.topHeader}>
        <View style={s.brandRow}>
          <ShieldFilledIcon size={20} color={COLORS.white} />
          <Text style={s.topHeaderTitle}>FIREWALL</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity onPress={onLock} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="lock" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="logout" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.mainContent}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* Cabeçalho da Tela */}
        <View style={s.headerBlock}>
          <Text style={s.title}>Seu Cofre</Text>
          <Text style={s.subtitle}>Protegido por criptografia padrão da indústria</Text>
        </View>

        {/* Busca usando o seu InputField já criado */}
        <View style={s.searchContainer}>
          <InputField
            label="" // Sem label neste caso
            placeholder="Buscar entradas..."
            value={search}
            onChangeText={setSearch}
            icon={<Search size={20} color={COLORS.placeholder} />}
          />
        </View>

        {/* Filtros */}
        <View style={s.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[s.filterChip, selectedCategory === cat && s.filterChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[s.filterText, selectedCategory === cat && s.filterTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Itens */}
        <View style={s.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <TouchableOpacity 
                key={item.id?.toString() || index.toString()} 
                activeOpacity={0.7} 
                onPress={() => onNavigateToDetail?.(item)}
              >
                <View pointerEvents="none">
                  <VaultItemCard 
                    title={item.title || 'Sem Título'}
                    subtitle={item.username || 'Sem descrição'}
                    categoryColor={COLORS.primary}
                    icon={<FontAwesome5 name="key" color={COLORS.primary} size={20} />}
                    warning={false}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={s.emptyText}>Nenhuma credencial encontrada.</Text>
          )}
        </View>

      </ScrollView>
      
      {/* Botão Flutuante Fixo */}
      <TouchableOpacity style={s.fab} activeOpacity={0.8} onPress={onNavigateToAdd}>
        <Plus size={24} color={COLORS.white} />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
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
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: 100, // Espaço para não esconder o último item atrás do botão
  },
  headerBlock: {
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.headline,
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: SPACING.xxl,
    marginBottom: -SPACING.md,
  },
  listContainer: {
    paddingHorizontal: SPACING.xxl,
    minHeight: 100,
  },
  emptyText: {
    fontFamily: FONTS.body,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SPACING.xl,
  },
  filterContainer: {
    marginBottom: SPACING.lg,
  },
  filterScroll: {
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxxl,
    right: SPACING.xxl,
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});