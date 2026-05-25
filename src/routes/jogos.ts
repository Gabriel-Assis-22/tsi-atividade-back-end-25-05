import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /jogos — Cadastrar um jogo
router.post('/', async (req: Request, res: Response) => {
  const { titulo, idGenero } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório.' });
  }

  if (!idGenero || typeof idGenero !== 'number') {
    return res.status(400).json({ erro: 'O campo "idGenero" é obrigatório e deve ser um número.' });
  }

  // Verifica se o gênero existe
  const generoExiste = await prisma.genero.findUnique({ where: { id: idGenero } });
  if (!generoExiste) {
    return res.status(404).json({ erro: `Gênero com id ${idGenero} não encontrado.` });
  }

  const jogo = await prisma.jogo.create({
    data: {
      titulo: titulo.trim(),
      idGenero,
    },
    include: {
      genero: true,
      plataformas: true,
    },
  });

  return res.status(201).json(jogo);
});

// GET /jogos — Listar todos os jogos com gênero e plataformas
router.get('/', async (_req: Request, res: Response) => {
  const jogos = await prisma.jogo.findMany({
    include: {
      genero: true,
      plataformas: true,
    },
  });

  return res.json(jogos);
});

// POST /jogos/:id/plataformas — Relacionar um jogo com plataformas
router.post('/:id/plataformas', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { plataformaIds } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'O id do jogo deve ser um número válido.' });
  }

  if (!Array.isArray(plataformaIds) || plataformaIds.length === 0) {
    return res.status(400).json({ erro: 'O campo "plataformaIds" deve ser um array não vazio de números.' });
  }

  const todosNumeros = plataformaIds.every((p) => typeof p === 'number');
  if (!todosNumeros) {
    return res.status(400).json({ erro: 'Todos os itens de "plataformaIds" devem ser números.' });
  }

  // Verifica se o jogo existe
  const jogoExiste = await prisma.jogo.findUnique({ where: { id } });
  if (!jogoExiste) {
    return res.status(404).json({ erro: `Jogo com id ${id} não encontrado.` });
  }

  // Verifica se todas as plataformas existem
  const plataformasExistentes = await prisma.plataforma.findMany({
    where: { id: { in: plataformaIds } },
  });

  if (plataformasExistentes.length !== plataformaIds.length) {
    const encontradosIds = plataformasExistentes.map((p) => p.id);
    const naoEncontrados = plataformaIds.filter((pid) => !encontradosIds.includes(pid));
    return res.status(404).json({
      erro: `Plataforma(s) não encontrada(s): ${naoEncontrados.join(', ')}.`,
    });
  }

  // Vincula as plataformas ao jogo (connect adiciona sem remover as existentes)
  const jogoAtualizado = await prisma.jogo.update({
    where: { id },
    data: {
      plataformas: {
        connect: plataformaIds.map((pid: number) => ({ id: pid })),
      },
    },
    include: {
      genero: true,
      plataformas: true,
    },
  });

  return res.json(jogoAtualizado);
});

export default router;
