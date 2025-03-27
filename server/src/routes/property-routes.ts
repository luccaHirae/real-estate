import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
} from '../controllers/property-controllers';
import { authMiddleware } from '../middleware/auth-middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post(
  '/',
  authMiddleware(['manager']),
  upload.array('photos'),
  createProperty
);

export default router;
