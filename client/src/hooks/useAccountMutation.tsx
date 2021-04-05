import request from 'graphql-request'
import { Variables } from 'graphql-request/dist/types'
import { useMutation, useQueryClient } from 'react-query'
import { CREATE_ACCOUNT_MUTATION } from '../common/gql/Mutations'
import { endpoint } from '../util/Api'

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (variables: Variables) =>
      request(endpoint, CREATE_ACCOUNT_MUTATION, variables),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entries')
      },
    }
  )
}
