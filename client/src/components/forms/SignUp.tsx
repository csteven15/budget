import React, { FC, useState } from 'react'
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import fire from '../../util/fire'
import { useAuth } from '../../context/AuthContext'

interface IFormData {
  email: string
  name: string
  password: string
}

const SignUp: FC = () => {
  const { signIn } = useAuth()
  const history = useHistory()
  const toast = useToast()
  const [show, setShow] = useState(false)
  const { register, handleSubmit } = useForm()

  const handleClick = () => setShow(!show)

  const onSubmit = async (formData: IFormData) => {
    try {
      const res = await fire
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
      await res.user?.updateProfile({ displayName: formData.name })
      signIn(res.user!.uid, formData.name)
      toast({
        title: `Successfully signed up.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      history.push('/dashboard')
    } catch (error) {
      console.log(error)
      toast({
        title: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Stack maxW="container.sm" mx="auto">
      <Input
        placeholder="Email"
        name="email"
        ref={register({ required: true })}
      />
      <Input
        placeholder="Full Name"
        name="name"
        ref={register({ required: true })}
      />
      <InputGroup size="md">
        <Input
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          name="password"
          ref={register({ required: true })}
        />
        <InputRightElement width="4.5rem">
          <Button onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
        </InputRightElement>
      </InputGroup>
      <Flex>
        <Button w="full" onClick={handleSubmit(onSubmit)}>
          Sign Up
        </Button>
      </Flex>
    </Stack>
  )
}

export default SignUp
