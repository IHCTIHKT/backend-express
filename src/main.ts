import express from 'express';

const server = express();

const port = 2000;

server.listen(port, () => {
    console.log(`Server is started on port ${port}...`);
});