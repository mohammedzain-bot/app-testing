import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { categoriesRouter } from './routes/categories';
import { servicesRouter } from './routes/services';
import { bookingsRouter } from './routes/bookings';
import { providersRouter } from './routes/providers';
import { adminRouter } from './routes/admin';
import { reviewsRouter } from './routes/reviews';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'On-Demand Service Marketplace API is running!' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reviews', reviewsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
