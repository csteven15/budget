import request from 'graphql-request'
import { Variables } from 'graphql-request/dist/types'
import { useMutation } from 'react-query'
import { endpoint } from '../util/Api'

export const useGenericMutation = (mutationSchema: string) => {
  return useMutation((variables: Variables) =>
    request(endpoint, mutationSchema, variables)
  )
}
