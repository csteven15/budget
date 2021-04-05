import { GET_ENTRIES } from '../common/gql/Queries'
import { useAuth } from '../context/AuthContext'
import { endpoint } from '../util/Api'
import { request } from 'graphql-request'
import { useQuery } from 'react-query'
import { Variables } from 'graphql-request/dist/types'

export const useEntriesQuery = () => {
  const { user } = useAuth()

  const variables = {
    payload: {
      userId: user.uid,
    },
  }

  return useQuery(
    'entries',
    async () => await request(endpoint, GET_ENTRIES, variables),
    { enabled: !!variables.payload.userId }
  )
}

export const useEntriesQueryCalendar = (variables: Variables) => {
  return useQuery(
    'entries-calendar',
    async () => await request(endpoint, GET_ENTRIES, variables),
    { enabled: !!variables.payload.userId }
  )
}

export const useEntriesQueryYear = (variables: Variables) => {
  const { user } = useAuth()

  variables.payload.userId = user.uid

  return useQuery(
    'entries-year',
    async () => await request(endpoint, GET_ENTRIES, variables),
    { enabled: !!variables.payload.userId }
  )
}
