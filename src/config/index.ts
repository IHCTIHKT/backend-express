import { config as readEnv } from 'dotenv';

readEnv();

const appConfig = {
  port: process.env.PORT ?? 2000,
};

export default appConfig;