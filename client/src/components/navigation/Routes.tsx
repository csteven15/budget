import React from 'react'
import { Switch, Route } from "react-router-dom";

import Budget from "../forms/Budget";
import Income from "../forms/Income";
import Expense from "../forms/Expense";

export default function Routes() {
  return (
    <Switch>
      <Route path="/budget">
        <Budget />
      </Route>
      <Route path="/income">
        <Income />
      </Route>
      <Route path="/expense">
        <Expense />
      </Route>
    </Switch>
  )
}
