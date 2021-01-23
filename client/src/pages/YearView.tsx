import React, { FC } from 'react';
import {
  Table, TableHead, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from "@material-ui/core";
import { useEntry } from "../context/EntryContext";
import { months } from '../common/enums/EMonths';

const YearView: FC = () => {
  const { entries } = useEntry();
  let incomeCount: number = 0;
  let incomeTotal: number = 0;
  let expenseCount: number = 0;
  let expenseTotal: number = 0;
  entries.forEach(entry => {
    if (entry.inputType === 0) {
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

  const renderEntryNamesFromType = (inputType: number) => {
    const array = entries.map((entry, i) => {
      if (entry.inputType === inputType) {
        return (
          <TableCell key={i}>{entry.name}</TableCell>
        );
      }
      return (null);
    });
    return array;
  };

  const renderEntryAmounts = () => {
    const array = entries.map((entry, i) => {
      return (
        <TableCell key={i}>{entry.maxAmount}</TableCell>
      );
    });
    return array;
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
              {renderEntryNamesFromType(0)}
              {renderEntryNamesFromType(1)}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              months.map(month => {
                return (
                  <TableRow key={month}>
                    <TableCell>{month}</TableCell>
                    {renderEntryAmounts()}
                    <TableCell>{incomeTotal - expenseTotal}</TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default YearView;