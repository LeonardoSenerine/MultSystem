/** Equipamentos do formulário "Fale com o técnico". */
export const equipamentosAssistencia = ["Notebook", "Computador de mesa", "Nobreak", "Outro"] as const;

export type EquipamentoAssistencia = (typeof equipamentosAssistencia)[number];
