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
