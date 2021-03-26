import React, { FC } from 'react'
import {
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  ButtonGroup,
  Flex,
  useEditableControls,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'

interface EditableCellProps {
  value: string
}

const EditableCell: FC<EditableCellProps> = ({ value }) => {
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          aria-label="Call Sage"
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="Call Sage"
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          aria-label="Call Sage"
          icon={<EditIcon />}
          {...getEditButtonProps()}
        />
      </Flex>
    )
  }

  return (
    <div>
      <Editable textAlign="center" isPreviewFocusable={false} value={value}>
        <EditablePreview />
        <EditableInput />
        <EditableControls />
      </Editable>
    </div>
  )
}

const BudgetView: FC = () => {
  return <p>BudgetView</p>
}
export default BudgetView
