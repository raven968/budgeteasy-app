export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

/** Response of POST /auth/login and /auth/register. */
export type AuthToken = {
  token: string;
  token_type: 'Bearer';
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
  device_name: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name: string;
};
