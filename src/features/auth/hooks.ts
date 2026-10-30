import { useMutation } from '@tanstack/react-query';

import { login, register } from './api';
import { useAuth } from './auth-provider';
import { getDeviceName } from './device-name';
import type { LoginFormValues, RegisterFormValues } from './schemas';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (values: LoginFormValues) => login({ ...values, device_name: getDeviceName() }),
    onSuccess: signIn,
  });
}

export function useRegister() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (values: RegisterFormValues) => register({ ...values, device_name: getDeviceName() }),
    onSuccess: signIn,
  });
}
