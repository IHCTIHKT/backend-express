import pino from 'pino';

const logger = pino({
  level: 'info',
  transport: {
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: './logs/app.log',
          mkdir: true,
        },
      },
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          sync: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    ],
  },
});

export default logger;
