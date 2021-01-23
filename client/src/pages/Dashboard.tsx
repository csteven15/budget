import React, { FC } from "react";
import EntryForm from "../components/forms/Entry";
import { useAuth } from "../context/AuthContext";

const Dashboard: FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center" }}>
      <p>Welcome {user.name}</p>
      <EntryForm />
    </div>
  );
};

export default Dashboard;
