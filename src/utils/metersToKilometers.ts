export function metersToKilomenters(visibilityMt: number): string {
  const visibilityKm = visibilityMt / 1000;
  return `${visibilityKm.toFixed(0)}km`;
}
