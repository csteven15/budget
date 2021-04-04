import { gql } from 'graphql-request'

export const CREATE_ENTRY_MUTATION = gql`
  mutation createEntry($payload: CreateEntryInput!) {
    createEntry(payload: $payload) {
      _id
      userId
    }
  }
`

export const UPDATE_ENTRY_MUTATION = gql`
  mutation updateEntry($payload: UpdateEntryInput!) {
    updateEntry(payload: $payload) {
      _id
    }
  }
`
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($payload: CreateAccountInput!) {
    createAccount(payload: $payload) {
      _id
      userId
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

export const DELETE_AMOUNT_MUTATION = gql`
  mutation deleteAmount($_id: ID!) {
    deleteAmount(_id: $_id) {
      _id
    }
  }
`
