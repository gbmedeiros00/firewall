import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { FONTS, SPACING, RADIUS } from '../theme';
import InputField from '../components/InputField';
import VaultItemCard from '../components/VaultItemCard';
import HealthScoreCard from '../components/HealthScoreCard';
import { Search, Plus } from 'lucide-react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; // Keep FontAwesome5 for other icons if needed
import { ShieldFilledIcon } from '../icons'; // Import the ShieldFilledIcon
import ScreenWrapper from '../components/ScreenWrapper';
import { API_URL } from '../config';
import PageHeader from '../components/PageHeader';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface VaultHomeScreenProps {
  token?: string | null;
  onNavigateToAdd?: () => void;
  onNavigateToAudit?: () => void;
  onNavigateToDetail?: (credential: any) => void;
}

export default function VaultHomeScreen({ token, onNavigateToAdd, onNavigateToAudit, onNavigateToDetail }: VaultHomeScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthReport, setHealthReport] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Máximo de senhas por página

  const { colors, isDark } = useTheme();
  const s = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const CATEGORIES = ['Todos', 'Trabalho', 'Social', 'Finanças', 'Jogos'];

  useEffect(() => {
    if (token) {
      fetchCredentials();
      fetchHealthReport();
    } else {
      setCredentials([]);
      setHealthReport(null);
      setIsLoading(false);
    }
  }, [token]);

  // Reseta para a primeira página sempre que o usuário digitar na busca ou trocar a categoria
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, credentials]);

  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
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

  const fetchHealthReport = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vault/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHealthReport(data);
      }
    } catch (error) {
      console.error('Erro ao buscar o relatório de saúde', error);
    }
  };

  const filteredData = credentials.filter(item => {
    const title = item.title || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Lógica matemática para exibir a página correta
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : colors.primary} />
      
      {/* Header Superior Fixo */}
      <View style={s.topHeader}>
        <View style={s.brandRow}>
          <ShieldFilledIcon size={20} color={isDark ? colors.primary : '#FFFFFF'} />
          <Text style={s.topHeaderTitle}>FIREWALL</Text>
        </View>
      </View>

      <View style={s.mainContent}>
      <ScreenWrapper contentContainerStyle={s.scrollContent}>
        {/* Cabeçalho da Tela */}
        <PageHeader 
          title="Seu Cofre" 
          subtitle="Protegido por criptografia padrão da indústria" 
        />

        {/* Card de Saúde do Cofre */}
        {credentials.length > 0 && (
          <View style={s.healthContainer}>
            <HealthScoreCard 
              report={healthReport} 
              isLoading={isLoading} 
              onSeeDetails={onNavigateToAudit}
            />
          </View>
        )}

        {/* Busca usando o seu InputField já criado */}
        <View style={s.searchContainer}>
          <InputField
            label="" // Sem label neste caso
            placeholder="Buscar entradas..."
            value={search}
            onChangeText={setSearch}
            icon={<Search size={20} color={colors.placeholder} />}
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
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: SPACING.xl }} />
          ) : filteredData.length > 0 ? (
            <>
            {paginatedData.map((item, index) => (
              <TouchableOpacity 
                key={item.id?.toString() || index.toString()} 
                activeOpacity={0.7} 
                onPress={() => onNavigateToDetail?.(item)}
              >
                <View pointerEvents="none">
                  <VaultItemCard 
                    title={item.title || 'Sem Título'}
                    subtitle={item.username || 'Sem descrição'}
                    categoryColor={colors.primary}
                    icon={<FontAwesome5 name="key" color={colors.primary} size={20} />}
                    warning={false}
                  />
                </View>
              </TouchableOpacity>
            ))
            }
            
            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <View style={s.paginationContainer}>
                <TouchableOpacity 
                  style={[s.pageBtn, currentPage === 1 && s.pageBtnDisabled]}
                  onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <Text style={s.pageBtnText}>Anterior</Text>
                </TouchableOpacity>
                
                <Text style={s.pageText}>{currentPage} de {totalPages}</Text>
                
                <TouchableOpacity 
                  style={[s.pageBtn, currentPage === totalPages && s.pageBtnDisabled]}
                  onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <Text style={s.pageBtnText}>Próximo</Text>
                </TouchableOpacity>
              </View>
            )}
            </>
          ) : (
            <Text style={s.emptyText}>Nenhuma credencial encontrada.</Text>
          )}
        </View>

        {/* Respiro final garantido para forçar a rolagem além do botão Flutuante */}
        <View style={s.bottomSpacer} />

      </ScreenWrapper>
      
      {/* Botão Flutuante Fixo */}
      <TouchableOpacity style={s.fab} activeOpacity={0.8} onPress={onNavigateToAdd}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: 20, 
  },
  healthContainer: {
    paddingHorizontal: SPACING.xxl,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  pageBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
  },
  pageBtnDisabled: { opacity: 0.5 },
  pageBtnText: {
    fontFamily: FONTS.body, fontWeight: '700',
    color: colors.primary, fontSize: 12,
  },
  pageText: {
    fontFamily: FONTS.body, fontWeight: '600',
    color: colors.textSecondary, fontSize: 13,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSpacer: {
    height: 120, // Espaço físico para garantir que a paginação fique acima do FAB ao rolar
  },
});