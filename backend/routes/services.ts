import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const servicesRouter = Router();

// GET /api/services - All services (optionally filtered by categoryId)
servicesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { categoryId: String(categoryId) } : {};
    const services = await prisma.service.findMany({ where, include: { category: true } });
    return res.json(services);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/services
servicesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.body;
    const svc = await prisma.service.create({ data: { name, categoryId } });
    return res.status(201).json(svc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
