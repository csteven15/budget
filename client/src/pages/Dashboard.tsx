import React, { FC, useState } from 'react'
import EntryForm from '../components/forms/Entry'
import AccountForm from '../components/forms/Account'
import { useAuth } from '../context/AuthContext'
import { gql, useQuery } from '@apollo/client'

interface output {
  name: string
  _id: string
}

interface input {
  filter?: filter
  payload?: payload
}

interface filter {
  startDate?: Date
  endDate?: Date
}

interface payload {
  _id?: string
  name?: string
  type?: string
  userId?: string
}

const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput) {
    entries(filter: $filter, payload: $payload) {
      name
      _id
      amounts {
        date
        amount
      }
    }
  }
`

const Dashboard: FC = () => {
  const { user } = useAuth()

  const [filter, setfilter] = useState('')

  const updatefitler = (event: any) => {
    setfilter(event.target.value)
  }

  const filterObject =
    filter === ''
      ? {}
      : {
          name: filter,
        }

  const { data, refetch } = useQuery<output, input>(GET_ENTRIES, {
    variables: {
      filter: {},
      payload: filterObject,
    },
  })

  console.log('data', data)

  return (
    <div style={{ textAlign: 'center' }}>
      <input onChange={updatefitler} value={filter} />
      <button onClick={() => refetch()}>button</button>
      <p>Welcome {user.name}</p>
      <EntryForm />
      <br />
      <AccountForm />
      {JSON.stringify(data, null, 2)}
    </div>
  )
}

export default Dashboard
