import React, { FC, ReactNode, useState } from 'react';
import {
  Table, TableHead, TableBody, TableCell,
  TableContainer, TableRow, Paper, Modal
} from "@material-ui/core";
import { useEntry, } from "../context/EntryContext";
import { EInputType, MonthArray } from '../common/enums';
import { IEntry } from '../common/types';
import EntryForm from "../components/forms/Entry";

interface IModalState {
  isOpen: boolean;
  entry: IEntry | undefined;
}

let defaultModalState: IModalState = {
  isOpen: false,
  entry: undefined
};

const YearView: FC = () => {
  const { entries } = useEntry();
  const [modalState, openModal] = useState<IModalState>(defaultModalState);
  let date = new Date();

  // sort by InputType
  const sortedByInputTypeArray = entries.sort((a, b) => a.inputType - b.inputType);
  const sortedByIncomeName = sortedByInputTypeArray.filter(entry => entry.inputType === EInputType.Income).sort((a, b) => a.name.localeCompare(b.name));
  const sortedByExpenseName = sortedByInputTypeArray.filter(entry => entry.inputType === EInputType.Expense).sort((a, b) => a.name.localeCompare(b.name));
  const sortedEntries = [...sortedByIncomeName, ...sortedByExpenseName];

  let incomeCount: number = sortedByIncomeName.length;

  const handleModalOpen = (entry: IEntry) => {
    openModal({ isOpen: true, entry: entry });
  };

  const handleModalClose = () => {
    openModal({ isOpen: false, entry: undefined });
  };

  const renderTableEntry = () => {
    let tableBody: ReactNode[] = [];
    sortedEntries.forEach((entry: IEntry, i: number) => {
      let tableRow = [];
      if (i === 0 || i === incomeCount) {
        tableRow.push(<TableCell key={i + entry.name}>{`${EInputType[entry.inputType]}`}</TableCell>);
      } else {
        tableRow.push(<TableCell key={i + entry.name}></TableCell>);
      }
      tableRow.push(<TableCell>{entry.name}</TableCell>);
      const monthlyAmount = entry.monthlyAmount.map((monthlyAmount, i) => <TableCell key={i}>{monthlyAmount}</TableCell>);
      tableRow.push(monthlyAmount);
      const totalAmount = entry.monthlyAmount.reduce((total: number, currentValue: any) => total + parseFloat(currentValue), 0.0);
      tableRow.push(<TableCell>{totalAmount}</TableCell>);
      tableBody.push(<TableRow onClick={() => handleModalOpen(entries[i])}>{tableRow}</TableRow>);
    });
    return tableBody;
  };

  const renderTableBalance = () => {
    let monthlyTotal: number[] = [];
    for (let i = 0; i < MonthArray.length; i++) {
      let totalIncome = sortedByIncomeName.reduce((accumulator, { monthlyAmount }: { monthlyAmount: any; }) => accumulator + parseFloat(monthlyAmount[i]), 0);
      let totalExpense = sortedByExpenseName.reduce((accumulator, { monthlyAmount }: { monthlyAmount: any; }) => accumulator + parseFloat(monthlyAmount[i]), 0);
      monthlyTotal.push(totalIncome - totalExpense);
    };
    let tableRow = [];
    tableRow.push(<TableCell>Balance</TableCell>);
    tableRow.push(<TableCell></TableCell>);
    const monthlyAmountCells = monthlyTotal.map((monthlyAmount, i) => <TableCell key={i}>{monthlyAmount}</TableCell>);
    tableRow.push(monthlyAmountCells);
    tableRow.push(<TableCell></TableCell>);
    return <TableRow>{tableRow}</TableRow>;
  };

  return (
    <Paper>
      <div>{date.toDateString()}</div>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              {MonthArray.map(month => (<TableCell key={month}>{month}</TableCell>))}
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableEntry()}
            {renderTableBalance()}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={modalState.isOpen} onClose={handleModalClose}>
        <EntryForm entry={modalState.entry} isEditing={true} />
      </Modal>
    </Paper>
  );
};

export default YearView;