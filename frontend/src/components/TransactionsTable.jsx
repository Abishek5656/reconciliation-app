import React, { useEffect, useState } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip,
    TablePagination
} from '@mui/material';
import { CLASSIFICATION_LABELS } from '../constants/classification';

const TransactionsTable = ({ transactions, count, page, onPageChange, rowsPerPage }) => {
    
    // Status color helper
    const getStatusColor = (classification) => {
        switch (classification) {
            case 5: return 'success'; // Green
            case 6: return 'warning'; // Orange
            case 7: return 'error';   // Red
            default: return 'default';
        }
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Partner Pin</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Statement ($)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Settlement ($)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Variance</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(transactions) && transactions.map((txn) => (
                            <TableRow key={txn._id} hover>
                                <TableCell>{txn.source}</TableCell>
                                <TableCell>{txn.partnerPin} {txn.isDuplicate && <Chip label="Dup" size="small" color="secondary" />}</TableCell>
                                <TableCell>{txn.transactionType}</TableCell>
                                <TableCell align="right">{txn.statementAmount || '-'}</TableCell>
                                <TableCell align="right">{txn.settlementAmountUSD ? txn.settlementAmountUSD.toFixed(2) : '-'}</TableCell>
                                <TableCell align="right" sx={{ color: txn.varianceAmount ? 'red' : 'inherit' }}>
                                    {txn.varianceAmount !== null ? txn.varianceAmount.toFixed(2) : '-'}
                                </TableCell>
                                <TableCell>
                                    {txn.classification ? (
                                        <Chip 
                                            label={CLASSIFICATION_LABELS[txn.classification] || txn.classification} 
                                            color={getStatusColor(txn.classification)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ) : (
                                        <Chip label="Pending" size="small" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!transactions || transactions.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page - 1} // MUI uses 0-based
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                onRowsPerPageChange={(e) => {
                    // Handle rows per page details if needed passed props
                }}
            />
        </Paper>
    );
};

export default TransactionsTable;
