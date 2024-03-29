import axios from 'axios'

const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

export default axios.create({
  baseURL: isDevelopment ? 'http://localhost:3001' : 'backend',
})
