export const MACHINE_TYPES = [
  { value: 'trator', label: 'Trator' },
  { value: 'colheitadeira', label: 'Colheitadeira' },
  { value: 'pulverizador', label: 'Pulverizador' },
  { value: 'caminhao', label: 'Caminhão' },
  { value: 'implemento', label: 'Implemento' },
  { value: 'outro', label: 'Outro' },
];

export const MAINTENANCE_TYPES = [
  { value: 'abastecimento', label: 'Abastecimento' },
  { value: 'troca_oleo', label: 'Troca de óleo' },
  { value: 'troca_pneu', label: 'Troca de pneu' },
  { value: 'troca_peca', label: 'Troca de peça' },
  { value: 'revisao', label: 'Revisão' },
  { value: 'outro', label: 'Outro' },
];

export function labelFor(list, value) {
  return list.find((item) => item.value === value)?.label || value;
}

export const COLORS = {
  green900: '#1b3a2b',
  green700: '#2f6b45',
  green600: '#3d8557',
  green500: '#4caf6a',
  green100: '#e6f4ea',
  bg: '#f6f8f5',
  card: '#ffffff',
  text: '#1f2a24',
  muted: '#5f6f66',
  border: '#d8e2dc',
  danger: '#c0392b',
};
