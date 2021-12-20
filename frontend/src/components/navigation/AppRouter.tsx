import { FC, lazy, LazyExoticComponent, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Center, Spinner } from '@chakra-ui/react'

import Navigation from './Navigation'

interface IRoute {
  path: string
  component: LazyExoticComponent<FC>
}

const routes: IRoute[] = [
  {
    path: '/',
    component: lazy(() => import('../../pages/HomeView')),
  },
  {
    path: '/signin',
    component: lazy(() => import('../../pages/SignInView')),
  },
  {
    path: '/dashboard',
    component: lazy(() => import('../../pages/DashboardView')),
  },
  {
    path: '/budgetview',
    component: lazy(() => import('../../pages/BudgetView')),
  },
]

const AppRouter: FC = () => {
  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner />
        </Center>
      }
    >
      <BrowserRouter>
        <Navigation>
          <Switch>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                exact
                component={route.component}
              />
            ))}
          </Switch>
        </Navigation>
      </BrowserRouter>
    </Suspense>
  )
}

export default AppRouter
