import { TableCell, TableRow, withStyles } from '@material-ui/core';

export const BoldTableHeadCell = withStyles(() => ({
    head: {
      fontWeight: 'bold',
      backgroundColor: '#64b5f6'
    },
}))(TableCell);

type TableRowType = typeof TableRow;

export const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
}))(TableRow as TableRowType);