import { FC } from 'react'
import AppRouter from './components/navigation/AppRouter'
import { isDevelopment } from './util/Api'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

console.log('isdevelopment', isDevelopment)

const queryClient = new QueryClient()

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
)

export default App
