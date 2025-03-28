import express from 'express';
import {
  createTenant,
  getCurrentResidences,
  getTenant,
  updateTenant,
} from '../controllers/tenant-controllers';

const router = express.Router();

router.get('/:cognitoId', getTenant);
router.get('/:cognitoId/current-residences', getCurrentResidences);
router.put('/:cognitoId', updateTenant);
router.post('/', createTenant);

export default router;
