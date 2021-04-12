import { FC, useState } from 'react'
import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import fire from '../../util/fire'

interface IFormData {
  email: string
  name?: string
  password?: string
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
    if (process === 'start') {
      try {
        const res = await fire.auth().fetchSignInMethodsForEmail(formData.email)
        if (res.length === 0) setProcess('signup')
        if (res[0] === 'password') setProcess('signin')
      } catch (error) {
        console.error(error)
        toast({
          title: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
    if (process === 'signup') {
      try {
        const res = await fire
          .auth()
          .createUserWithEmailAndPassword(formData.email, formData!.password!)
        await fire
          .auth()
          .currentUser?.updateProfile({ displayName: formData!.name })
        signIn(res.user!.uid!, formData!.name!)
        toast({
          title: `Successfully signed in.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        history.push('/dashboard')
      } catch (error) {
        console.error(error)
        toast({
          title: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
    if (process === 'signin') {
      try {
        const res = await fire
          .auth()
          .signInWithEmailAndPassword(formData.email, formData!.password!)
        signIn(res.user!.uid!, res.user!.displayName!)
        toast({
          title: `Successfully signed in.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        history.push('/dashboard')
      } catch (error) {
        console.error(error)
        toast({
          title: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const ProcessText = () => {
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
      {process === 'signin' || process === 'start' ? null : (
        <Input
          placeholder="Full Name"
          name="name"
          ref={register({ required: true })}
        />
      )}
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
      <Center>
        <Button w="full" onClick={handleSubmit(onSubmit)}>
          {ProcessText()}
        </Button>
      </Center>
    </Stack>
  )
}

export default SignIn
