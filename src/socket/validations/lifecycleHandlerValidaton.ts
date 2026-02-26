import { z } from 'zod';
import { USER_ROLES } from '../../modules/user/user.constant';

// objectId validation schema

const ObjectId = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId format');

export const connectionLifeCycleHandlerValidationSchema = z.object({
  userId: ObjectId,
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.DRIVER, USER_ROLES.RIDER], {
    errorMap: (issue, ctx) => ({
      message: 'Invalid role',
    }),
  }),
}).strict();
