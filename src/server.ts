import express from 'express';
import generosRouter from './routes/generos';
import plataformasRouter from './routes/plataformas';
import jogosRouter from './routes/jogos';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Rotas
app.use('/generos', generosRouter);
app.use('/plataformas', plataformasRouter);
app.use('/jogos', jogosRouter);

// Rota raiz com documentação básica
app.get('/', (_req, res) => {
  res.json({
    mensagem: 'API REST – Gerenciamento de Jogos Digitais',
    versao: '1.0.0',
    endpoints: {
      generos: {
        'POST /generos': 'Cadastrar um gênero',
        'GET /generos': 'Listar gêneros com jogos',
      },
      plataformas: {
        'POST /plataformas': 'Cadastrar uma plataforma',
        'GET /plataformas': 'Listar plataformas com jogos',
      },
      jogos: {
        'POST /jogos': 'Cadastrar um jogo',
        'GET /jogos': 'Listar jogos com gênero e plataformas',
        'POST /jogos/:id/plataformas': 'Relacionar jogo com plataformas',
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

export default app;
