import React, { FC, useState } from 'react'
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import fire from '../../util/fire'
import { useAuth } from '../../context/AuthContext'

interface IFormData {
  email: string
  password: string
}

const SignIn: FC = () => {
  const { signIn } = useAuth()
  const history = useHistory()
  const toast = useToast()
  const [show, setShow] = useState(false)
  const [process, setProcess] = useState('start')
  const { register, handleSubmit } = useForm()

  const handleClick = () => setShow(!show)

  const onSubmit = async (formData: IFormData) => {
    try {
      const res = await fire
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
      signIn(res.user!.uid, res.additionalUserInfo!.username as string)
      toast({
        title: `Successfully signed in.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      history.push('/dashboard')
    } catch (error) {
      if (process === 'signin') {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setProcess('signin')
            break
          case 'auth/user-not-found':
            setProcess('signup')
            break
          case 'auth/wrong-password':
            toast({
              title: error.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
            break
          default:
            break
        }
      }
      if (process === 'signup') {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setProcess('signup')
            break
          default:
            break
        }
      }

      console.log(error)
    }
  }

  const ActionButtons = () => {
    if (process === 'start') return 'Next'
    if (process === 'signin') return 'Sign In'
    if (process === 'signup') return 'Sign Up'
  }

  return (
    <Stack maxW="container.sm" mx="auto">
      <Input
        placeholder="Email"
        name="email"
        ref={register({ required: true })}
      />
      {process === 'start' ? null : (
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
      )}
      <Flex>
        <Button w="48%" onClick={() => history.push('/signup')}>
          Sign Up
        </Button>
        <Spacer />
        <Button w="48%" onClick={handleSubmit(onSubmit)}>
          {ActionButtons()}
        </Button>
      </Flex>
    </Stack>
  )
}

export default SignIn
