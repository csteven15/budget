import { FC } from 'react'
import AppRouter from './components/navigation/AppRouter'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  DefaultOptions,
  createHttpLink,
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
  uri: isDevelopment ? 'http://localhost:3001/graphql' : undefined,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
  link: isDevelopment ? undefined : createHttpLink({ uri: '/graphql' })
})

const App: FC = () => (
  <ApolloProvider client={client}>
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
  </ApolloProvider>
)

export default App
