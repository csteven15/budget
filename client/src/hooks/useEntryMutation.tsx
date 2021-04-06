import request from 'graphql-request'
import { Variables } from 'graphql-request/dist/types'
import { useMutation, useQueryClient } from 'react-query'
import {
  CREATE_ENTRY_MUTATION,
  DELETE_ENTRY_MUTATION,
} from '../common/gql/Mutations'
import { endpoint } from '../util/Api'

export const useCreateEntryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (variables: Variables) =>
      request(endpoint, CREATE_ENTRY_MUTATION, variables),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entries')
        queryClient.invalidateQueries('amounts')
        queryClient.invalidateQueries('accounts')
      },
    }
  )
}

export const useDeleteEntryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (variables: Variables) =>
      request(endpoint, DELETE_ENTRY_MUTATION, variables),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entries')
        queryClient.invalidateQueries('accounts')
      },
    }
  )
}
