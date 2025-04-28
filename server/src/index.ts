import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import tenantRoutes from './routes/tenant-routes';
import managerRoutes from './routes/manager-routes';
import propertyRoutes from './routes/property-routes';
import leaseRoutes from './routes/lease-routes';
import applicationRoutes from './routes/application-routes';
import { authMiddleware } from './middleware/auth-middleware';

/* Config */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* Routes */
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/tenants', authMiddleware(['tenant']), tenantRoutes);
app.use('/managers', authMiddleware(['manager']), managerRoutes);
app.use('/properties', propertyRoutes);
app.use('/leases', leaseRoutes);
app.use('/applications', applicationRoutes);

/* Server */
const port = Number(process.env.PORT) || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
