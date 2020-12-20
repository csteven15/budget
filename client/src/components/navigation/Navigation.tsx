import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
}

export default function Navigation(props : Props) {
  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="/budget">Budget</Link>
          </li>
          <li>
            <Link to="/income">Income</Link>
          </li>
          <li>
            <Link to="/expense">Expense</Link>
          </li>
        </ul>
      </div>
      <div>
        { props.children }
      </div>
    </div>
  )
}