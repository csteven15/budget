import React, { FC, ReactNode } from 'react';
import {
  Table, TableHead, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from "@material-ui/core";
import { useEntry, } from "../context/EntryContext";
import { EInputType, MonthArray } from '../common/enums';
import { IEntry } from '../common/types';

const YearView: FC = () => {
  const { entries, deleteEntry } = useEntry();
  // sort by InputType
  const sortedByInputTypeArray = entries.sort((a, b) => a.inputType - b.inputType);
  const sortedByIncomeName = sortedByInputTypeArray.filter(entry => entry.inputType === EInputType.Income).sort((a, b) => a.name.localeCompare(b.name));
  const sortedByExpenseName = sortedByInputTypeArray.filter(entry => entry.inputType === EInputType.Expense).sort((a, b) => a.name.localeCompare(b.name));
  const sortedEntries = [...sortedByIncomeName, ...sortedByExpenseName];

  let incomeCount: number = sortedByIncomeName.length;

  const renderTableEntry = () => {
    let tableBody: ReactNode[] = [];
    sortedEntries.forEach((entry: IEntry, i: number) => {
      let tableRow = [];
      if (i === 0 || i === incomeCount) {
        tableRow.push(<TableCell>{`${EInputType[entry.inputType]}`}</TableCell>);
      } else {
        tableRow.push(<TableCell></TableCell>);
      }
      tableRow.push(<TableCell>{entry.name}</TableCell>);
      const monthlyAmount = entry.monthlyAmount.map(monthlyAmount => <TableCell>{monthlyAmount}</TableCell>);
      tableRow.push(monthlyAmount);
      const totalAmount = entry.monthlyAmount.reduce((total: number, currentValue: any) => total + parseFloat(currentValue), 0.0);
      tableRow.push(<TableCell>{totalAmount}</TableCell>);
      tableBody.push(<TableRow onClick={() => deleteEntry(entries[i]._id as string)}>{tableRow}</TableRow>);
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
    const monthlyAmountCells = monthlyTotal.map(monthlyAmount => <TableCell>{monthlyAmount}</TableCell>);
    tableRow.push(monthlyAmountCells);
    tableRow.push(<TableCell></TableCell>);
    return <TableRow>{tableRow}</TableRow>;
  };

  return (
    <Paper>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              {MonthArray.map(month => (<TableCell>{month}</TableCell>))}
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableEntry()}
            {renderTableBalance()}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default YearView;