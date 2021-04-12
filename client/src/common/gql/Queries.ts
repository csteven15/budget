import { gql } from 'graphql-request'

export const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput!) {
    entries(filter: $filter, payload: $payload) {
      name
      userId
      _id
      type
      budgetedAmount
      startDate
      endDate
      createdAt
      amounts {
        _id
        amount
        date
        paid
      }
    }
  }
`

export const GET_ACCOUNTS = gql`
  query accounts($payload: GetAccountInput!) {
    accounts(payload: $payload) {
      _id
      userId
      name
      total
      type
      appliedToBudget
    }
  }
`
