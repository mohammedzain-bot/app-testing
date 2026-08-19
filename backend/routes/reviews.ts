import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const reviewsRouter = Router();

// POST /api/reviews
reviewsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { bookingId, authorId, subjectId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await prisma.review.create({
      data: { bookingId, authorId, subjectId, rating, comment },
    });

    // Recalculate provider rating
    const allReviews = await prisma.review.findMany({ where: { subjectId } });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await prisma.providerProfile.updateMany({ where: { userId: subjectId }, data: { rating: avg } });

    return res.status(201).json(review);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews/provider/:userId
reviewsRouter.get('/provider/:userId', async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { subjectId: req.params.userId },
      include: { author: { select: { name: true, profilePicture: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(reviews);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
