import { Router } from 'express';

import usersRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/contacts', usersRouter);
router.use('/auth', authRouter);

export default router;