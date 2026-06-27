import express from 'express';

const server = express();
const port = 2000;

server.get('/', (req, res) => {
  console.log('Пришел запрос с методом GET');
  res.send('Hello World! GET');
});


server.post('/', (req, res) => {
  console.log('Пришел запрос с методом POST');
  res.send('Hello World! POST');
});

server.put('/', (req, res) => {
  console.log('Пришелл запрос с методом PUT');
  res.send('Hello World! PUT');
});

server.delete('/', (req, res) => {
  console.log('Пришел запрос с методом DELETE');
  res.send('Hello World! DELETE');
});

server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);});