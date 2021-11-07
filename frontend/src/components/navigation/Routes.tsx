import React, { FC, lazy, LazyExoticComponent } from 'react'
import { Switch, Route } from 'react-router-dom'

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

const Routes: FC = () => {
  return (
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
  )
}

export default Routes
