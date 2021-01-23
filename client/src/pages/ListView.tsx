import React, { FC, useMemo } from 'react';
import {
  Table, TableHead, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from "@material-ui/core";
import { useEntry } from "../context/EntryContext";
import { useTable } from 'react-table';
import { IEntry } from '../common/types/IEntry';


const ListView: FC = () => {
  const { entries } = useEntry();
  const columns = React.useMemo(
    () => [
      {
        Header: 'List View',
        columns: [
          {
            Header: 'Year',
            accessor: 'year',
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Type',
            accessor: 'type',
          },
          {
            Header: 'MaxAmount',
            accessor: 'maxAmount',
          },
        ],
      },
    ],
    []
  );

  const data = useMemo(
    () => entries.map((entry: IEntry) => ({
      year: entry.year,
      name: entry.name,
      type: entry.inputType ? "Expense" : "Income",
      maxAmount: entry.maxAmount,
    })), [entries]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <Paper>
      <TableContainer>
        <Table {...getTableProps()} size="small" aria-label="a dense table">
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ListView;
