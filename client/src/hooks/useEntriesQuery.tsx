import { useQuery } from '@apollo/client'
import { GET_ENTRIES } from '../common/gql/Queries'
import { useAuth } from '../context/AuthContext'

export const useEntriesQueryCached = () => {
  const { user } = useAuth()

  const { data, loading, refetch } = useQuery(GET_ENTRIES, {
    variables: {
      payload: {
        userId: user.uid,
      },
    },
  })
  return { data, loading, refetch }
}
