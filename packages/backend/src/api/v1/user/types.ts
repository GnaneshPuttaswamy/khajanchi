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
