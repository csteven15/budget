import { makeStyles, Theme, createStyles } from '@material-ui/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const routes = [
  {
    path: '/',
    name: 'Home',
  },
]

const unprotectedRoutes = [
  {
    path: '/signin',
    name: 'Sign In',
  },
]

const protectedRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
  },
  {
    path: '/monthview',
    name: 'Month View',
  },
  {
    path: '/yearview',
    name: 'Year View',
  },
  {
    path: '/totalview',
    name: 'Total View',
  },
  {
    path: '/',
    name: 'Sign Out',
  },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      flex: '1 100%',
      height: '20vh',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    children: {
      flex: '1 100%',
      maxHeight: '100vh',
      backgroundColor: theme.palette.background.paper,
    },
  })
)

const Navigation: FC = ({ children }) => {
  const { user, signOut } = useAuth()
  const classes = useStyles()

  let combinedRoutes = routes

  if (user.isLoggedIn) {
    combinedRoutes = combinedRoutes.concat(protectedRoutes)
  } else {
    combinedRoutes = combinedRoutes.concat(unprotectedRoutes)
  }

  return (
    <div>
      <div className={classes.navigation}>
        <ul>
          {combinedRoutes.map((route) => (
            <li
              key={route.name}
              onClick={route.name === 'Sign Out' ? () => signOut() : undefined}
            >
              <Link to={route.path}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={classes.children}>{children}</div>
    </div>
  )
}

export default Navigation
