import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import Navigation from "./Navigation";
import Routes from "./Routes";

const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Navigation>
        <Routes />
      </Navigation>
    </BrowserRouter>
  )
}

export default AppRouter;