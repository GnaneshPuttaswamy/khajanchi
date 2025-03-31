import { z } from 'zod';

// User Registration
export const userRegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});
export type UserRegisterRequest = z.infer<typeof userRegisterRequestSchema>;
export type UserRegisterData = {
  token: string;
};

// User Login
export const userLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});
export type UserLoginRequest = z.infer<typeof userLoginRequestSchema>;
export type UserLoginData = {
  token: string;
};

// User Profile
export type UserProfileData = {
  email: string;
};

// Request Reset password
export const requestResetPasswordRequest = z.object({
  email: z.string().email(),
});
export type RequestResetPasswordRequest = z.infer<typeof requestResetPasswordRequest>;

// Reset Password
export const resetPasswordRequest = z.object({
  token: z.string({
    required_error: 'Token is required',
    invalid_type_error: 'Token must be a string',
  }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequest>;
