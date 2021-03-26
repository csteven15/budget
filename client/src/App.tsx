import { FC } from 'react'
import AppRouter from './components/navigation/AppRouter'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { isDevelopment } from './util/Api'
import { ChakraProvider } from '@chakra-ui/react'

console.log('isdevelopment', isDevelopment)

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
})

const App: FC = () => (
  <ApolloProvider client={client}>
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
  </ApolloProvider>
)

export default App
