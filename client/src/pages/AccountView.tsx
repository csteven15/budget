import React, { FC } from 'react'

import { useAuth } from '../context/AuthContext'
import { Box, Grid, Text } from '@chakra-ui/react'
import { UPDATE_ACCOUNT_MUTATION } from '../common/gql/Mutations'
import EditableTextField from '../components/forms/EditableTextField'
import { EAccountValues } from '../common/enums'
import EditableCheckbox from '../components/forms/EditableCheckbox'
import EditableSelect from '../components/forms/EditableSelect'
import { IAccountInfo } from '../common/gql/Types'
import { useAccountsQuery } from '../hooks/useAccountsQuery'

const AccountInfo: FC<IAccountInfo> = ({
  _id,
  name,
  total,
  type,
  appliedToBudget,
}) => {
  return (
    <Grid templateColumns="repeat(5, 1fr)" m={2}>
      <Box>
        <EditableTextField
          refName="name"
          id={_id}
          defaultValue={name}
          mutationSchema={UPDATE_ACCOUNT_MUTATION}
          type="string"
          required
        />
      </Box>
      <Box>
        <EditableSelect
          refName="type"
          id={_id}
          defaultValue={EAccountValues[type].value}
          mutationSchema={UPDATE_ACCOUNT_MUTATION}
          textToValueMapping={EAccountValues}
        />
      </Box>
      <Box>
        <EditableTextField
          refName="total"
          id={_id}
          defaultValue={total}
          mutationSchema={UPDATE_ACCOUNT_MUTATION}
          type="float"
          required
        />
      </Box>
      <Box>
        <EditableCheckbox
          id={_id}
          refName="appliedToBudget"
          defaultValue={appliedToBudget}
          mutationSchema={UPDATE_ACCOUNT_MUTATION}
        />
      </Box>
    </Grid>
  )
}

const HeaderForAccounts: FC = () => (
  <Grid templateColumns="repeat(5, 1fr)" m={2}>
    <Box>
      <Text>Name</Text>
    </Box>
    <Box>
      <Text>Type</Text>
    </Box>
    <Box>
      <Text>Total</Text>
    </Box>
    <Box>
      <Text>Applied To Balance?</Text>
    </Box>
  </Grid>
)

const AccountView: FC = () => {
  const { data } = useAccountsQuery()

  return (
    <>
      <Text>
        Total applied to budget
        {/* {'Total Applied to Budget: ' + getTotalAppliedToBudget()} */}
      </Text>
      <br />
      <HeaderForAccounts />
      {data?.accounts?.map((account: IAccountInfo) => (
        <AccountInfo key={account._id} {...account} />
      ))}
    </>
  )
}

export default AccountView
