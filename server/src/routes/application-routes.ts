import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
} from '../controllers/application-controllers';

const router = express.Router();

router.get('/', authMiddleware(['manager', 'tenant']), listApplications);
router.post('/', authMiddleware(['tenant']), createApplication);
router.put('/:id/status', authMiddleware(['manager']), updateApplicationStatus);

export default router;
