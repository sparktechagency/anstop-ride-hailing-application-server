import { z } from 'zod';

const authenticationValidationSchema = z.object({
  token: z.string().min(20).max(500),
});
