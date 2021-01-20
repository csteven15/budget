import React, { FC } from "react";
import { Link } from "react-router-dom";
import { months } from "../../common/enums/EMonths";
import { useAuth } from "../../context/AuthContext";
import { useEntry } from "../../context/EntryContext";

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
    path: "/",
    name: "Sign Out",
  },
];

const Navigation: FC = ({ children }) => {
  const { user, signOut } = useAuth();
  const { entries } = useEntry();

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
      <footer>
        {entries?.map((entry) => (
          <div key={entry._id}>
            <h4>Owner: {entry.uid}</h4>
            <p>Name: {entry.name}</p>
            <p>Type: {entry.inputType ? "Expense" : "Income"}</p>
            <p>Year: {entry.year}</p>
            <p>Max Amount: {entry.maxAmount}</p>
            <p>
              Amount:{" "}
              {entry.monthlyAmount.map(
                (amount, i) => `${months[i]}: $${amount} `
              )}
            </p>
          </div>
        ))}
      </footer>
    </div>
  );
};

export default Navigation;
