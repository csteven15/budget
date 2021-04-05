import request from 'graphql-request'
import { Variables } from 'graphql-request/dist/types'
import { useMutation, useQueryClient } from 'react-query'
import { endpoint } from '../util/Api'

export const useGenericMutation = (mutationSchema: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (variables: Variables) => request(endpoint, mutationSchema, variables),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entries')
        queryClient.invalidateQueries('amounts')
        queryClient.invalidateQueries('accounts')
      },
    }
  )
}
