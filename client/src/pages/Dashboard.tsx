import React, { FC } from 'react'
import EntryForm from '../components/forms/EntryForm'
import AccountForm from '../components/forms/AccountForm'
import { useAuth } from '../context/AuthContext'

const Dashboard: FC = () => {
  const { user } = useAuth()

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Welcome {user.name}</p>
      <EntryForm />
      <br />
      <AccountForm />
    </div>
  )
}

export default Dashboard
