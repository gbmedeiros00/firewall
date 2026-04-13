import { COLORS } from '../theme';

export interface StrengthLevel {
  label: string;
  color: string;
  filled: number;
}

export interface Requirement {
  key: string;
  label: string;
  met: boolean;
}

export function getStrength(pw: string): StrengthLevel {
  let s = 0;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;

  const map: StrengthLevel[] = [
    { label: 'Muito fraca', color: COLORS.error, filled: 0 },
    { label: 'Fraca', color: COLORS.error, filled: 1 },
    { label: 'Razoável', color: COLORS.warning, filled: 2 },
    { label: 'Forte', color: '#2E8B57', filled: 3 },
    { label: 'Muito forte', color: COLORS.success, filled: 4 },
  ];
  return map[s];
}

export function getRequirements(pw: string): Requirement[] {
  return [
    { key: 'length', label: '12 caracteres', met: pw.length >= 12 },
    { key: 'uppercase', label: 'Maiúscula', met: /[A-Z]/.test(pw) },
    { key: 'number', label: 'Número', met: /[0-9]/.test(pw) },
    { key: 'symbol', label: 'Símbolo', met: /[^A-Za-z0-9]/.test(pw) },
  ];
}