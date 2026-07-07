import express from 'express';

const server = express();
server.use(express.json());

server.post('/payload/:id', (req, res) => {
  const { id } = req.params;
  const { sort, page } = req.query;
  const body = req.body;

  res.json({
    params: { id },
    query: { sort, page },
    body: body,
  });
});

server.listen(2000);
  console.log('Сервер запущен!');
