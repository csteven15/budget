import React, { FC } from 'react'
import { Switch, Route } from "react-router-dom";
import Login from '../forms/Login';
import Register from '../forms/Register';

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </Switch>
  )
}

export default Routes;