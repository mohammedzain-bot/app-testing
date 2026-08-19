import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const bookingsRouter = Router();

const COMMISSION_RATE = parseFloat(process.env.COMMISSION_RATE || '0.10'); // 10% default

// GET /api/bookings - Get bookings for a user
bookingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { customerId, providerId, status } = req.query;
    const where: any = {};
    if (customerId) where.customerId = String(customerId);
    if (providerId) where.providerId = String(providerId);
    if (status) where.status = String(status);

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, profilePicture: true, phone: true } },
        provider: { select: { id: true, name: true, profilePicture: true, phone: true } },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(bookings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:id
bookingsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        customer: { select: { id: true, name: true, profilePicture: true, phone: true } },
        provider: {
          select: { id: true, name: true, profilePicture: true, phone: true },
        },
        payment: true,
        review: true,
      },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json(booking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - Create booking
bookingsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { customerId, serviceId, description, address, lat, lng, scheduledFor, problemPhotos, price } = req.body;

    const commission = price ? price * COMMISSION_RATE : null;

    const booking = await prisma.booking.create({
      data: {
        customerId,
        serviceId,
        description,
        address,
        lat,
        lng,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        problemPhotos: problemPhotos || [],
        price,
        commission,
      },
    });
    return res.status(201).json(booking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id/status - Update booking status
bookingsRouter.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, providerId } = req.body;
    const validStatuses = ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData: any = { status };
    if (providerId) updateData.providerId = providerId;
    if (status === 'STARTED') updateData.startedAt = new Date();
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: updateData,
      include: { customer: true, provider: true },
    });

    // If completed, update provider stats
    if (status === 'COMPLETED' && booking.providerId) {
      const reviews = await prisma.review.findMany({ where: { subjectId: booking.providerId } });
      const avg = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      await prisma.providerProfile.updateMany({
        where: { userId: booking.providerId },
        data: { totalJobs: { increment: 1 }, rating: avg },
      });
    }

    return res.json(booking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings/:id/payment - Record payment
bookingsRouter.post('/:id/payment', async (req: Request, res: Response) => {
  try {
    const { amount, transactionId, paymentMethod } = req.body;
    const payment = await prisma.payment.create({
      data: {
        bookingId: req.params.id,
        amount,
        status: 'COMPLETED',
        transactionId,
        paymentMethod,
      },
    });
    return res.status(201).json(payment);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
