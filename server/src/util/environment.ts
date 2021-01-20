var environment = process.env.NODE_ENV;

export const isDevelopment = environment === 'development';

export const dbPort = isDevelopment ? 27017 : 27018;

export const dbHost = isDevelopment ? 'localhost' : 'mongo';

export const db = isDevelopment ? 'dev' : 'prod';
