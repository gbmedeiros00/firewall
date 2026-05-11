import { useState, useCallback, useEffect } from 'react';
import * as Crypto from 'expo-crypto';
import { getStrength } from '../utils/passwordUtils';

export interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

export const usePasswordGenerator = (initialOptions?: Partial<PasswordOptions>) => {
  const [password, setPassword] = useState('');
  
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
    ...initialOptions,
  });

  const generatePassword = useCallback((currentOptions: PasswordOptions = options) => {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~|}{[]:;?><,./-=';

    let charsSet = '';
    if (currentOptions.lower) charsSet += lowerChars;
    if (currentOptions.upper) charsSet += upperChars;
    if (currentOptions.numbers) charsSet += numberChars;
    if (currentOptions.symbols) charsSet += symbolChars;
    
    // Fallback de segurança para evitar crash caso o usuário desative tudo
    if (!charsSet) charsSet = lowerChars; 

    let generated = '';
    const limit = 256 - (256 % charsSet.length);

    while (generated.length < currentOptions.length) {
      const randomBytes = Crypto.getRandomBytes(currentOptions.length);
      for (let i = 0; i < randomBytes.length; i++) {
        if (randomBytes[i] < limit) {
          generated += charsSet[randomBytes[i] % charsSet.length];
          if (generated.length === currentOptions.length) break;
        }
      }
    }
    setPassword(generated);
  }, [options]);

  // Gera uma nova senha automaticamente sempre que qualquer opção for alterada
  useEffect(() => {
    generatePassword(options);
  }, [options, generatePassword]);

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return {
    password,
    setPassword, // Permite a edição manual no TextInput
    options,
    updateOption,
    generatePassword,
  };
};