import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const categoriesRouter = Router();

// GET /api/categories - All categories
categoriesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.category.findMany({ include: { services: true } });
    return res.json(cats);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/categories - Create category (admin)
categoriesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, iconUrl } = req.body;
    const cat = await prisma.category.create({ data: { name, iconUrl } });
    return res.status(201).json(cat);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/categories/:id
categoriesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, iconUrl } = req.body;
    const cat = await prisma.category.update({ where: { id: req.params.id }, data: { name, iconUrl } });
    return res.json(cat);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categories/:id
categoriesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
