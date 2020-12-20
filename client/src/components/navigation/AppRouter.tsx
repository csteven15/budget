import React from "react";
import { BrowserRouter } from "react-router-dom";

import Navigation from "./Navigation";
import Routes from "./Routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navigation>
        <Routes />
      </Navigation>
    </BrowserRouter>

  )
}