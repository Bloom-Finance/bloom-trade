import { Typography } from "@mui/material";
import React from "react";
import CardSurfaces from "../surfaces/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Scrollbar from "../Scrollbar";

export interface TableRowProps {
  id: string;
  components: Array<JSX.Element>;
}

export interface TableHeadProps {
  id: string;
  label: string;
  width?: string;
}

export interface TableProps {
  title: string;
  head: Array<TableHeadProps>;
  rows: Array<TableRowProps>;
  maxHeight?: number;
}

const TableComponent = (props: TableProps): JSX.Element => {
  const { title, head, rows, maxHeight } = props;
  return (
    <CardSurfaces sx={{ py: 4 }}>
      <Typography variant="h5" px={5} pb={2}>
        {title}
      </Typography>
      <Scrollbar maxHeight={maxHeight}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {head.map((item) => (
                <TableCell width={item.width} key={item.id}>
                  {item.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.components.map((component) => (
                  <TableCell key={component.key}>{component}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </CardSurfaces>
  );
};

export default TableComponent;
