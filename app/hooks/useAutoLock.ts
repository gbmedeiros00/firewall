import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, DeviceEventEmitter } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const AUTO_LOCK_TIMEOUT_KEY = 'auto_lock_timeout';
export const EVENT_AUTO_LOCK_CHANGED = 'auto_lock_changed';

export function useAutoLock(onLock: () => void) {
  const appState = useRef(AppState.currentState);
  const lastInteraction = useRef(Date.now());
  const backgroundTime = useRef<number | null>(null);
  
  // Padrão de 5 minutos (300.000 ms) em caso de primeira execução
  const [timeoutMs, setTimeoutMs] = useState<number>(300000);

  const loadSettings = useCallback(async () => {
    try {
      const val = await SecureStore.getItemAsync(AUTO_LOCK_TIMEOUT_KEY);
      if (val) {
        setTimeoutMs(parseInt(val, 10));
      }
    } catch (error) {
      console.error("Erro ao carregar timer de segurança:", error);
    }
  }, []);

  // Carrega a config no boot e escuta mudanças feitas em tempo real nas Configurações
  useEffect(() => {
    loadSettings();
    const listener = DeviceEventEmitter.addListener(EVENT_AUTO_LOCK_CHANGED, (newMs: number) => {
      setTimeoutMs(newMs);
      resetTimer(); // Zera o contador usando a nova rigidez escolhida
    });
    return () => listener.remove();
  }, [loadSettings]);

  // Função consumida pela raiz do App para avisar que o usuário está ativo
  const resetTimer = () => {
    lastInteraction.current = Date.now();
  };

  useEffect(() => {
    // 1. Escudo Ativo: Verifica inatividade com o app aberto a cada 5 segundos
    const interval = setInterval(() => {
      if (timeoutMs > 0 && Date.now() - lastInteraction.current > timeoutMs) {
        onLock();
      }
    }, 5000);

    // 2. Escudo Passivo: Verifica transições do Sistema Operacional (Background / Lockscreen)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        // App foi minimizado ou a tela do celular foi desligada
        backgroundTime.current = Date.now();
        if (timeoutMs === 0) {
          onLock(); // Bloqueio imediato ao perder o foco (Rigidez máxima)
        }
      } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App voltou à tela
        if (backgroundTime.current && timeoutMs > 0) {
          const timeInBackground = Date.now() - backgroundTime.current;
          if (timeInBackground > timeoutMs) {
            onLock(); // Tempo em background excedeu o limite
          }
        }
        backgroundTime.current = null;
        resetTimer(); // Dá uma sobrevida de UX quando volta e passa no teste
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [timeoutMs, onLock]);

  return { resetTimer };
}