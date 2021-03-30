import { FC } from 'react'
import AppRouter from './components/navigation/AppRouter'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  DefaultOptions,
} from '@apollo/client'
import { isDevelopment } from './util/Api'
import { ChakraProvider } from '@chakra-ui/react'

console.log('isdevelopment', isDevelopment)

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
}

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
})

const App: FC = () => (
  <ApolloProvider client={client}>
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
  </ApolloProvider>
)

export default App
