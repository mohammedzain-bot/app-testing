import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const adminRouter = Router();

// GET /api/admin/stats - Dashboard analytics
adminRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      cancelledBookings,
      activeBookings,
      todayPayments,
      monthPayments,
      pendingVerifications,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'PROVIDER' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.booking.count({ where: { status: { in: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'] } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: todayStart } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: monthStart } } }),
      prisma.providerProfile.count({ where: { isVerified: false } }),
    ]);

    const totalRevenue = await prisma.booking.aggregate({
      _sum: { commission: true },
      where: { status: 'COMPLETED' },
    });

    return res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      cancelledBookings,
      activeBookings,
      todayRevenue: todayPayments._sum.amount || 0,
      monthlyRevenue: monthPayments._sum.amount || 0,
      totalPlatformCommission: totalRevenue._sum.commission || 0,
      pendingVerifications,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users - List all users
adminRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : {},
      include: { providerProfile: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(users);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/providers/:id/verify - Approve/reject provider
adminRouter.put('/providers/:id/verify', async (req: Request, res: Response) => {
  try {
    const { isVerified } = req.body;
    const profile = await prisma.providerProfile.update({
      where: { id: req.params.id },
      data: { isVerified },
    });
    return res.json({ message: `Provider ${isVerified ? 'approved' : 'rejected'}.`, profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/bookings - All bookings
adminRouter.get('/bookings', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const bookings = await prisma.booking.findMany({
      where: status ? { status: status as any } : {},
      include: {
        customer: { select: { name: true, phone: true } },
        provider: { select: { name: true, phone: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(bookings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/revenue - Revenue breakdown
adminRouter.get('/revenue', async (_req: Request, res: Response) => {
  try {
    const last6Months: { month: string; revenue: number; bookings: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const [agg, cnt] = await Promise.all([
        prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: d, lt: nextD } } }),
        prisma.booking.count({ where: { createdAt: { gte: d, lt: nextD } } }),
      ]);
      last6Months.push({
        month: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: agg._sum.amount || 0,
        bookings: cnt,
      });
    }
    return res.json(last6Months);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
