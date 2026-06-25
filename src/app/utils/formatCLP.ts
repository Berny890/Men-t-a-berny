export const formatCLP = (value: number): string => {
  return '$' + Math.round(value).toLocaleString('es-CL');
};

export const roundToHundred = (value: number): number => {
  return Math.round(value / 100) * 100;
};
