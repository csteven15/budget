import React, { FC } from 'react'
import { useAuth } from '../context/AuthContext'
import { Center, Grid, GridItem, Heading } from '@chakra-ui/react'
import ListView from './ListView'
import AccountView from './AccountView'

const Dashboard: FC = () => {
  const { user } = useAuth()

  return (
    <Grid templateColumns="repeat(2, 1fr)" width="100%" padding="1">
      <GridItem rowSpan={1} colSpan={2}>
        <Center my="3">
          <Heading as="h6" size="md">
            Welcome {user.name}
          </Heading>
        </Center>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <ListView />
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <AccountView />
      </GridItem>
    </Grid>
  )
}

export default Dashboard
