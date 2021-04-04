import React, { FC } from 'react'
import { useAuth } from '../context/AuthContext'
import { Center, Heading, SimpleGrid, Stack } from '@chakra-ui/react'
import ListView from './ListView'
import AccountView from './AccountView'

const Dashboard: FC = () => {
  const { user } = useAuth()

  return (
    <Stack>
      <Center my="3">
        <Heading as="h6" size="md">
          Welcome {user.name}
        </Heading>
      </Center>
      <SimpleGrid columns={[1, null, 2]} width="100%" padding="1">
        <Center flexDirection="row" alignItems="flex-start">
          <ListView />
        </Center>
        <Center flexDirection="row" alignItems="flex-start">
          <AccountView />
        </Center>
      </SimpleGrid>
    </Stack>
  )
}

export default Dashboard
