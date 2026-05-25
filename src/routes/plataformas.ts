import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /plataformas — Cadastrar uma plataforma
router.post('/', async (req: Request, res: Response) => {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
  }

  const plataforma = await prisma.plataforma.create({
    data: { nome: nome.trim() },
  });

  return res.status(201).json(plataforma);
});

// GET /plataformas — Listar todas as plataformas com seus jogos
router.get('/', async (_req: Request, res: Response) => {
  const plataformas = await prisma.plataforma.findMany({
    include: {
      jogos: {
        include: {
          genero: true,
        },
      },
    },
  });

  return res.json(plataformas);
});

export default router;
