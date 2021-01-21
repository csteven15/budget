import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

let routes = [
  {
    path: "/",
    name: "Home",
  },
];

const unprotectedRoutes = [
  {
    path: "/signin",
    name: "Sign In",
  },
];

const protectedRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/table",
    name: "Table",
  },
  {
    path: "/",
    name: "Sign Out",
  },
];

const Navigation: FC = ({ children }) => {
  const { user, signOut } = useAuth();

  let combinedRoutes = routes;

  if (user.isLoggedIn) {
    combinedRoutes = combinedRoutes.concat(protectedRoutes);
  } else {
    combinedRoutes = combinedRoutes.concat(unprotectedRoutes);
  }

  return (
    <div>
      <div>
        <ul>
          {combinedRoutes.map((route) => (
            <li
              key={route.name}
              onClick={route.name === "Sign Out" ? () => signOut() : undefined}
            >
              <Link to={route.path}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Navigation;
