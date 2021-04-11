import { FC } from 'react'
import { Center, Flex, Heading, SimpleGrid, Stack } from '@chakra-ui/react'

import AccountView from './AccountView'
import ListView from './ListView'
import { useAuth } from '../context/AuthContext'

const DashboardView: FC = () => {
  const { user } = useAuth()

  return (
    <Stack w="100%">
      <Center my="3">
        <Heading as="h6" size="md">
          Welcome {user.name}
        </Heading>
      </Center>
      <SimpleGrid columns={[1, null, 2]} width="100%" padding="1">
        <Flex>
          <ListView />
        </Flex>
        <Flex>
          <AccountView />
        </Flex>
      </SimpleGrid>
    </Stack>
  )
}

export default DashboardView
