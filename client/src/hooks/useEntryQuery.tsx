import { GET_ENTRIES } from '../common/gql/Queries'
import { useAuth } from '../context/AuthContext'
import { endpoint } from '../util/Api'
import { request } from 'graphql-request'
import { useQuery } from 'react-query'

export const useEntryQuery = () => {
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

export const useEntryQueryCalendar = (startDate: Date, endDate: Date) => {
  const { user } = useAuth()

  const variables = {
    filter: {
      ...startDate,
      ...endDate,
    },
    payload: {
      userId: user.uid,
    },
  }

  return useQuery(
    'entries-calendar',
    async () => await request(endpoint, GET_ENTRIES, variables),
    { enabled: !!variables.payload.userId }
  )
}

export const useEntryQueryYear = (date: Date) => {
  const { user } = useAuth()

  const variables = {
    filter: {
      startDate: new Date(date.getFullYear(), 0, 1),
      endDate: new Date(date.getFullYear() + 1, 0, 0),
    },
    payload: {
      userId: user.uid,
    },
  }

  return useQuery(
    'entries-year',
    async () => await request(endpoint, GET_ENTRIES, variables),
    { enabled: !!variables.payload.userId }
  )
}
