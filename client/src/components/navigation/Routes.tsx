import React, { FC } from 'react';
import { Switch, Route } from "react-router-dom";
import Dashboard from '../../pages/Dashboard';
import SignIn from '../forms/SignIn';
import ListView from '../../pages/ListView';
import YearView from '../../pages/YearView';
import TotalView from '../../pages/TotalView';

const routes = [
  {
    path: "/signin",
    component: <SignIn />
  },
  {
    path: "/dashboard",
    component: <Dashboard />
  },
  {
    path: "/listview",
    component: <ListView />
  },
  {
    path: "/yearview",
    component: <YearView />
  },
  {
    path: "/totalView",
    component: <TotalView />
  }
];

const Routes: FC = () => {
  return (
    <Switch>
      {
        routes.map(route => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))
      }
    </Switch>
  );
};

export default Routes;