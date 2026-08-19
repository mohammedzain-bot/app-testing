import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const authRouter = Router();

// POST /api/auth/register - Register or login a user
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, email, name, role, firebaseUid } = req.body;
    
    if (!role || !['CUSTOMER', 'PROVIDER'].includes(role)) {
      return res.status(400).json({ error: 'Role must be CUSTOMER or PROVIDER' });
    }

    // Check existing user
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : {},
          email ? { email } : {},
          firebaseUid ? { firebaseUid } : {},
        ].filter(w => Object.keys(w).length > 0),
      },
    });

    if (existing) {
      return res.json({ user: existing, message: 'User already exists, logged in.' });
    }

    const user = await prisma.user.create({
      data: { phone, email, name, role, firebaseUid },
    });

    // If provider, create an empty provider profile
    if (role === 'PROVIDER') {
      await prisma.providerProfile.create({ data: { userId: user.id } });
    }

    return res.status(201).json({ user, message: 'User registered successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me/:userId - Get user profile
authRouter.get('/me/:userId', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: { providerProfile: { include: { services: { include: { service: true } } } } },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/profile/:userId - Update profile
authRouter.put('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { name, profilePicture, bio, experience, lat, lng } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { name, profilePicture },
    });

    if (user.role === 'PROVIDER' && (bio !== undefined || experience !== undefined)) {
      await prisma.providerProfile.update({
        where: { userId: user.id },
        data: { bio, experience, lat, lng },
      });
    }

    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
