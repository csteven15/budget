import { FC } from 'react'
import {
  Flex,
  IconButton,
  Spacer,
  Stack,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  Text,
  Collapse,
  Divider,
  Container,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

interface IRoute {
  path: string
  name: string
}

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Home',
  },
]

const unprotectedRoutes: IRoute[] = [
  {
    path: '/signin',
    name: 'Sign In',
  },
]

const protectedRoutes: IRoute[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
  },
  {
    path: '/budgetview',
    name: 'Budget View',
  },
  {
    path: '/',
    name: 'Sign Out',
  },
]

const Navigation: FC = ({ children }) => {
  const { user, signOut } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()
  const { isOpen, onToggle, onClose } = useDisclosure()
  const menuBreakpoint = useBreakpointValue({ base: false, md: true })
  const iconBreakpoint = useBreakpointValue({ base: 'sm', md: 'md' })

  let combinedRoutes = routes

  if (user.isLoading) {
    return (
      <Center height="100vh">
        <Spinner />
      </Center>
    )
  }

  if (user.isLoggedIn) {
    combinedRoutes = combinedRoutes.concat(protectedRoutes)
  } else {
    combinedRoutes = combinedRoutes.concat(unprotectedRoutes)
  }

  const CollapseableMenu: FC = () => (
    <Stack p={2}>
      {combinedRoutes.map((menuItem: IRoute) => (
        <Link
          key={menuItem.name + 'collapse'}
          to={menuItem.path}
          onClick={() => {
            if (menuItem.path === '/' && menuItem.name === 'Sign Out') signOut()
            onClose()
          }}
        >
          <Text
            fontWeight={
              location.pathname === menuItem.path &&
              menuItem.name === 'Sign Out'
                ? 'bold'
                : 'medium'
            }
          >
            {menuItem.name}
          </Text>
        </Link>
      ))}
    </Stack>
  )

  const DefaultMenu: FC = () => (
    <Flex hidden={!menuBreakpoint} p={2}>
      <Link to="/">
        <Text fontWeight="bold" p={2}>
          Budget
        </Text>
      </Link>
      <Spacer />
      {combinedRoutes.map((menuItem: IRoute) => (
        <Link
          key={menuItem.name + ' default'}
          to={menuItem.path}
          onClick={() => {
            if (menuItem.path === '/' && menuItem.name === 'Sign Out') signOut()
          }}
        >
          <Text
            fontWeight={
              location.pathname === menuItem.path &&
              menuItem.name !== 'Sign Out'
                ? 'bold'
                : 'medium'
            }
            p={2}
          >
            {menuItem.name}
          </Text>
        </Link>
      ))}
      <IconButton
        aria-label="theme"
        variant="ghost"
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        size={iconBreakpoint}
      />
    </Flex>
  )

  return (
    <Container maxW="container.xl">
      <Flex hidden={menuBreakpoint} p={2}>
        <IconButton
          aria-label="nav-menu"
          variant="ghost"
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          size={iconBreakpoint}
        />
        <Spacer />
        <Link to="/">
          <Text fontWeight="bold">Budget</Text>
        </Link>
        <Spacer />
        <IconButton
          aria-label="theme"
          variant="ghost"
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          size={iconBreakpoint}
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <CollapseableMenu />
      </Collapse>
      <DefaultMenu />
      <Divider marginBottom={4} />
      <Container centerContent maxW="container.xl">
        {children}
      </Container>
      {/* <Footer /> */}
    </Container>
  )
}

export default Navigation
