export function ConvertWindSpeed(speedInMeterPerSecond: number): string {
  const speedInKilometerPerHour = speedInMeterPerSecond * 3.6;
  return `${speedInKilometerPerHour.toFixed(0)} km/h`;
}
