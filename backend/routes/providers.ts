import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const providersRouter = Router();

// GET /api/providers - Search nearby providers for a service
providersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.query;
    const where: any = { isVerified: true, available: true };

    const providerServices = serviceId
      ? await prisma.providerService.findMany({
          where: { serviceId: String(serviceId) },
          include: {
            providerProfile: {
              include: {
                user: { select: { id: true, name: true, profilePicture: true } },
                services: { include: { service: true } },
              },
            },
          },
        })
      : [];

    if (serviceId) {
      const providers = providerServices.map((ps) => ({
        ...ps.providerProfile,
        basePrice: ps.basePrice,
      }));
      return res.json(providers);
    }

    const profiles = await prisma.providerProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, profilePicture: true } },
        services: { include: { service: true } },
      },
    });
    return res.json(profiles);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/providers/:id - Single provider profile
providersRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.providerProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, profilePicture: true } },
        services: { include: { service: { include: { category: true } } } },
      },
    });
    if (!profile) return res.status(404).json({ error: 'Provider not found' });

    // Get recent reviews
    const reviews = await prisma.review.findMany({
      where: { subjectId: profile.userId },
      include: { author: { select: { name: true, profilePicture: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return res.json({ ...profile, reviews });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/providers/:id/location - Update provider live location
providersRouter.put('/:id/location', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    const profile = await prisma.providerProfile.update({
      where: { id: req.params.id },
      data: { lat, lng },
    });
    return res.json({ lat: profile.lat, lng: profile.lng });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/providers/:id/availability
providersRouter.put('/:id/availability', async (req: Request, res: Response) => {
  try {
    const { available } = req.body;
    await prisma.providerProfile.update({ where: { id: req.params.id }, data: { available } });
    return res.json({ message: 'Availability updated.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/providers/:id/services - Add service to provider
providersRouter.post('/:id/services', async (req: Request, res: Response) => {
  try {
    const { serviceId, basePrice } = req.body;
    const ps = await prisma.providerService.create({
      data: { providerProfileId: req.params.id, serviceId, basePrice },
    });
    return res.status(201).json(ps);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/providers/:id/earnings - Provider earnings dashboard
providersRouter.get('/:id/earnings', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.providerProfile.findUnique({ where: { id: req.params.id }, include: { user: true } });
    if (!profile) return res.status(404).json({ error: 'Provider not found' });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allCompleted, todayJobs, weekJobs, monthJobs] = await Promise.all([
      prisma.booking.findMany({
        where: { providerId: profile.userId, status: 'COMPLETED' },
        include: { payment: true },
      }),
      prisma.booking.findMany({
        where: { providerId: profile.userId, status: 'COMPLETED', completedAt: { gte: todayStart } },
        include: { payment: true },
      }),
      prisma.booking.findMany({
        where: { providerId: profile.userId, status: 'COMPLETED', completedAt: { gte: weekStart } },
        include: { payment: true },
      }),
      prisma.booking.findMany({
        where: { providerId: profile.userId, status: 'COMPLETED', completedAt: { gte: monthStart } },
        include: { payment: true },
      }),
    ]);

    const sum = (bookings: any[]) =>
      bookings.reduce((acc, b) => acc + (b.price || 0) - (b.commission || 0), 0);

    return res.json({
      todayEarnings: sum(todayJobs),
      weeklyEarnings: sum(weekJobs),
      monthlyEarnings: sum(monthJobs),
      totalEarnings: sum(allCompleted),
      completedJobs: allCompleted.length,
      rating: profile.rating,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
