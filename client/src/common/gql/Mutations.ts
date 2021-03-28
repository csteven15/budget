import { gql } from '@apollo/client'

export const UPDATE_ENTRY_MUTATION = gql`
  mutation updateEntry($payload: UpdateEntryInput!) {
    updateEntry(payload: $payload) {
      _id
    }
  }
`

export const UPDATE_ACCOUNT_MUTATION = gql`
  mutation updateAccount($payload: UpdateAccountInput!) {
    updateAccount(payload: $payload) {
      _id
    }
  }
`

export const UPDATE_AMOUNT_MUTATION = gql`
  mutation updateAmount($payload: UpdateAmountInput!) {
    updateAmount(payload: $payload) {
      _id
    }
  }
`
