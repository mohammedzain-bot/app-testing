import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma';

export const authRouter = Router();

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohamedzain600890@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '', // Must be set in .env
  },
  tls: {
    rejectUnauthorized: false
  }
});

// POST /api/auth/send-otp
authRouter.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // Upsert into VerificationCode
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    // Send Email
    if (process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: 'mohamedzain600890@gmail.com',
        to: email,
        subject: 'Your Login OTP for On-Demand Services',
        text: `Your OTP is: ${code}. It expires in 10 minutes.`,
      });
    } else {
      console.warn(`[OTP] Email not sent to ${email} (No GMAIL_APP_PASSWORD in .env). OTP is: ${code}`);
    }

    return res.json({ message: 'OTP sent successfully' });
  } catch (err: any) {
    console.error('Email sending failed:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-otp
authRouter.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, code, role = 'CUSTOMER' } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const verification = await prisma.verificationCode.findUnique({ where: { email } });
    if (!verification) return res.status(400).json({ error: 'No OTP requested for this email' });

    if (verification.code !== code) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date() > verification.expiresAt) return res.status(400).json({ error: 'OTP has expired' });

    // Clean up OTP
    await prisma.verificationCode.delete({ where: { email } });

    // Create or find user
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { email, role },
      });
      // If provider, create an empty provider profile
      if (role === 'PROVIDER') {
        await prisma.providerProfile.create({ data: { userId: user.id } });
      }
    }

    return res.status(200).json({ user, message: 'Verified successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register - Legacy route (kept for fallback)
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
