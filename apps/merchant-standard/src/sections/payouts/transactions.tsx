import { Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import Label from "../../components/label";
import QuickTransfer from "../../components/quickTransfer";
import TableComponent, {
  TableHeadProps,
  TableRowProps,
} from "../../components/table";
import { fCurrency } from "@bloom-trade/utilities";

export interface PayOutsRowsProps {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
  status: "pending" | "completed" | "failed";
}

export interface PayOutTransactionsProps {
  headListTransactions: Array<TableHeadProps>;
  rowsListTransactions: Array<PayOutsRowsProps>;
}

const PayOutTransactions = (props: PayOutTransactionsProps): JSX.Element => {
  const { headListTransactions, rowsListTransactions } = props;
  const parseRow = (row: PayOutsRowsProps) => {
    return {
      id: row.id,
      components: [
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
          }}
        >
          {row.date}
        </Typography>,
        <Typography variant="body1">{row.from}</Typography>,
        <Typography variant="body1">{row.to}</Typography>,
        <Typography variant="body1">{fCurrency(row.amount)}</Typography>,
        <Label color={row.status === "completed" ? "success" : "info"}>
          {row.status}
        </Label>,
      ],
    };
  };

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12} md={8}>
        <TableComponent
          head={headListTransactions}
          rows={rowsListTransactions.map(parseRow)}
          maxHeight={340}
          title="Last Payouts"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack spacing={2}>
          <QuickTransfer />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PayOutTransactions;
