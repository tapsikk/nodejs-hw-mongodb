import { Router } from 'express';

import usersRouter from './contacts.js';
import authRouter from './auth.js';
import { swaggerDocs } from '../middlewares/swaggerDocs.js';

const router = Router();

router.use('/contacts', usersRouter);
router.use('/auth', authRouter);
router.use('/api-docs', swaggerDocs());

export default router;