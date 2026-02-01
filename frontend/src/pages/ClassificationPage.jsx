import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import TransactionsTable from '../components/TransactionsTable';
import { getTransactions, triggerReconciliation, getSummary } from '../api/transactions.api';

const ClassificationPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [count, setCount] = useState(0);

    const fetchData = async () => {
        try {
            const response = await getTransactions({ page, limit: 10 });
            const data = response.data;
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
            setCount(data.totalItems || 0); 
            
            const summaryData = await getSummary();
            setSummary(summaryData.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleReconcile = async () => {
        try {
            await triggerReconciliation();
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', background: '-webkit-linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Reconciliation Report
                </Typography>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<SyncIcon />}
                    onClick={handleReconcile}
                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                >
                    Run Reconciliation
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ background: '#e8f5e9', borderLeft: '6px solid #4CAF50' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Present in Both</Typography>
                            <Typography variant="h3">{summary.find(s => s._id === 5)?.count || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ background: '#fff3e0', borderLeft: '6px solid #FF9800' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Settlement Only</Typography>
                            <Typography variant="h3">{summary.find(s => s._id === 6)?.count || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ background: '#ffebee', borderLeft: '6px solid #F44336' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Statement Only</Typography>
                            <Typography variant="h3">{summary.find(s => s._id === 7)?.count || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <TransactionsTable 
                transactions={transactions} 
                count={count}
                page={page}
                onPageChange={setPage}
                rowsPerPage={10}
            />
        </Container>
    );
};

export default ClassificationPage;
