import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const routes = [
  {
    path: "/register",
    name: "Register"
  },
  {
    path: "/login",
    name: "Login"
  }
]

const Navigation: FC = ({ children })  => {
  const { user } = useUser();
  return (
    <div>
      {JSON.stringify(user, null, 2)}
      <div>
        <ul>
          {
            routes.map(route => (
              <li key={route.name}>
                <Link to={route.path}>{route.name}</Link>
              </li>
            ))
          }
        </ul>
      </div>
      <div>
        { children }
      </div>
    </div>
  )
}

export default Navigation;