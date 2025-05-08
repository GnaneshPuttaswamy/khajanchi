import { z } from 'zod';

// User Profile
export type UserProfileData = {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

// Google Sign In
export const googleSignInRequestSchema = z.object({
  code: z.string({
    required_error: 'Authorization code is required',
    invalid_type_error: 'Authorization code must be a string',
  }),
  scope: z.string().optional(),
  authuser: z.string().optional(),
  prompt: z.string().optional(),
});
export type GoogleSignInRequest = z.infer<typeof googleSignInRequestSchema>;
export type GoogleSignInData = {
  token: string;
};
