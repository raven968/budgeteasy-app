import * as Device from 'expo-device';

/**
 * Name sent as `device_name` so each device gets its own API token.
 */
export function getDeviceName(): string {
  return Device.deviceName ?? Device.modelName ?? 'BudgetEasy';
}
