import { GET_ACCOUNTS } from '../common/gql/Queries'
import { useAuth } from '../context/AuthContext'
import { endpoint } from '../util/Api'
import { request } from 'graphql-request'
import { useQuery } from 'react-query'

export const useAccountsQuery = () => {
  const { user } = useAuth()

  const variables = {
    payload: {
      userId: user.uid,
    },
  }

  return useQuery(
    'accounts',
    async () => await request(endpoint, GET_ACCOUNTS, variables)
  )
}

export const useAccountsYearQuery = () => {
  const { user } = useAuth()

  const variables = {
    payload: {
      userId: user.uid,
      appliedToBudget: true,
    },
  }

  return useQuery(
    'accounts-year',
    async () => await request(endpoint, GET_ACCOUNTS, variables)
  )
}
