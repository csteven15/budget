import request from 'graphql-request'
import { Variables } from 'graphql-request/dist/types'
import { useMutation, useQueryClient } from 'react-query'
import { DELETE_AMOUNT_MUTATION } from '../common/gql/Mutations'
import { endpoint } from '../util/Api'

export const useDeleteAmountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (variables: Variables) =>
      request(endpoint, DELETE_AMOUNT_MUTATION, variables),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entries')
      },
    }
  )
}
