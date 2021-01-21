import React, { FC } from "react";
import EntryForm from "../components/forms/Entry";
import { useAuth } from "../context/AuthContext";
import ListView from "./ListView";

const Dashboard: FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center" }}>
      <p>Welcome {user.name}</p>
      <EntryForm />
      <ListView />
    </div>
  );
};

export default Dashboard;
