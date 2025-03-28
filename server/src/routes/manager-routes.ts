import express from 'express';
import {
  createManager,
  getManager,
  getManagerProperties,
  updateManager,
} from '../controllers/manager-controllers';

const router = express.Router();

router.get('/:cognitoId', getManager);
router.get('/:cognitoId/properties', getManagerProperties);
router.put('/:cognitoId', updateManager);
router.post('/', createManager);

export default router;
