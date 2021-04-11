import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import SignIn from '../forms/SignIn'
import AccountView from '../../pages/AccountView'
import ListView from '../../pages/ListView'
import BudgetView from '../../pages/BudgetView'
import Home from '../../pages/Home'
import SignUp from '../forms/SignUp'

interface IRoute {
  path: string
  component: JSX.Element
}

const routes: IRoute[] = [
  {
    path: '/',
    component: <Home />,
  },
  {
    path: '/signin',
    component: <SignIn />,
  },
  {
    path: '/signup',
    component: <SignUp />,
  },
  {
    path: '/dashboard',
    component: <Dashboard />,
  },
  {
    path: '/accountview',
    component: <AccountView />,
  },
  {
    path: '/listview',
    component: <ListView />,
  },
  {
    path: '/budgetview',
    component: <BudgetView />,
  },
]

const Routes: FC = () => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} exact>
          {route.component}
        </Route>
      ))}
    </Switch>
  )
}

export default Routes
