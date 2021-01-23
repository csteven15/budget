import React, { FC } from 'react';
import {
  Table, TableHead, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from "@material-ui/core";
import { useEntry } from "../context/EntryContext";
import { EInputType, MonthArray } from '../common/enums';
import { IEntry } from '../common/types';

const YearView: FC = () => {
  const { entries } = useEntry();
  // sort by InputType
  const sortedByInputTypeArray = entries.sort((a, b) => a.inputType - b.inputType);
  const sortedByIncomeName = sortedByInputTypeArray.filter(entry => entry.inputType === EInputType.Income).sort((a, b) => a.name.localeCompare(b.name));
  const sortedByExpenseName = sortedByInputTypeArray.filter(entry => entry.inputType === EInputType.Expense).sort((a, b) => a.name.localeCompare(b.name));
  const sortedArray = [...sortedByIncomeName, ...sortedByExpenseName];

  let incomeCount: number = sortedByIncomeName.length;
  let incomeTotal: number = sortedByIncomeName.reduce((accumulator: number, { maxAmount }) => accumulator + maxAmount, 0);

  let expenseCount: number = sortedByExpenseName.length;
  let expenseTotal: number = sortedByExpenseName.reduce((accumulator: number, { maxAmount }) => accumulator + maxAmount, 0);

  const renderTypeHeaders = (type: string, count: number) => {

    const array = [...Array(count)].map((e, i) => {
      if (i === 0) {
        return (<TableCell key={i}>{type}</TableCell>);
      }
      else {
        return (<TableCell key={i}></TableCell>);
      }
    });
    return array;
  };

  const renderEntryNamesFromType = () => {
    const entryNames = sortedArray.map((entry: IEntry, i: number) => (
      <TableCell key={i}>{entry.name}</TableCell>
    ));
    return entryNames;
  };

  const renderEntryAmounts = (monthIndex: number) => {
    const entryAmounts = sortedArray.map((entry: IEntry, i: number) => (
      <TableCell key={i}>{entry.monthlyAmount[monthIndex]}</TableCell>
    ));
    return entryAmounts;
  };

  return (
    <Paper>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              {renderTypeHeaders("Income", incomeCount)}
              {renderTypeHeaders("Expenses", expenseCount)}
              <TableCell>Balance</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {renderEntryNamesFromType()}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              MonthArray.map((month: string, i: number) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  {renderEntryAmounts(i)}
                  <TableCell>{incomeTotal - expenseTotal}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default YearView;