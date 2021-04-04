const environment = process.env.NODE_ENV

export const isDevelopment = environment === 'development'

export const endpoint = isDevelopment
  ? 'http://localhost:3001/graphql'
  : '/graphql'
