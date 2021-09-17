import { FC } from 'react'
import AppRouter from './components/navigation/AppRouter'
import { isDevelopment } from './util/Api'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

console.log('development:', isDevelopment)

const queryClient = new QueryClient()

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
  </QueryClientProvider>
)

export default App
