import { z } from 'zod';

export const idSchema = z.preprocess(
  (val) => (typeof val === 'string' ? +val : val),
  z.number({
    required_error: 'id is required',
    invalid_type_error: 'id must be a number',
  })
);

export const idParamsSchema = z.object({
  id: idSchema,
});

export type IdParams = z.infer<typeof idParamsSchema>;
