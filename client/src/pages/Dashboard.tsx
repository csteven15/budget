import React, { FC } from 'react'
import EntryForm from '../components/forms/EntryForm'
import AccountForm from '../components/forms/AccountForm'
import { useAuth } from '../context/AuthContext'
import { Container, Text } from '@chakra-ui/react'

const Dashboard: FC = () => {
  const { user } = useAuth()

  return (
    <Container>
      <Text>Welcome {user.name}</Text>
      <br />
      <Container
        maxW="container.md"
        boxShadow="base"
        p="6"
        rounded="md"
        bg="white"
      >
        <EntryForm />
      </Container>
      <br />
      <Container
        maxW="container.md"
        boxShadow="base"
        p="6"
        rounded="md"
        bg="white"
      >
        <AccountForm />
      </Container>
    </Container>
  )
}

export default Dashboard
