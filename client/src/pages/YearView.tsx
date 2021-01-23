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
  let incomeCount: number = 0;
  let incomeTotal: number = 0;
  let expenseCount: number = 0;
  let expenseTotal: number = 0;

  // sort by InputType
  const sortedByInputTypeArray = entries.sort((a, b) => a.inputType - b.inputType);

  entries.forEach(entry => {
    if (entry.inputType === EInputType.Income) {
      incomeCount++;
      incomeTotal += entry.maxAmount;
    }
    else {
      expenseCount++;
      expenseTotal += entry.maxAmount;
    }
  });

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
    const entryNames = sortedByInputTypeArray.map((entry: IEntry, i: number) => (
      <TableCell key={i}>{entry.name}</TableCell>
    ));
    return entryNames;
  };

  const renderEntryAmounts = (monthIndex: number) => {
    const entryAmounts = sortedByInputTypeArray.map((entry: IEntry, i: number) => (
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