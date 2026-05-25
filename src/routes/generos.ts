import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /generos — Cadastrar um gênero
router.post('/', async (req: Request, res: Response) => {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
  }

  const genero = await prisma.genero.create({
    data: { nome: nome.trim() },
  });

  return res.status(201).json(genero);
});

// GET /generos — Listar todos os gêneros com seus jogos
router.get('/', async (_req: Request, res: Response) => {
  const generos = await prisma.genero.findMany({
    include: {
      jogos: {
        include: {
          plataformas: true,
        },
      },
    },
  });

  return res.json(generos);
});

export default router;
