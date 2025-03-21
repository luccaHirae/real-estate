import express from 'express';
import { createTenant, getTenant } from '../controllers/tenant-controllers';

const router = express.Router();

router.get('/:cognitoId', getTenant);
router.post('/', createTenant);

export default router;
