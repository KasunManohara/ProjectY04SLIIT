import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

const ViewGrowShed = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/growshed');
                setRows(response.data); // Assuming the response.data is an array of objects with the same structure as your hard-coded data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid>
            <div>
                <Typography variant="h3">
                    Growsheds
                </Typography>
                <br/>
                <hr/>
            </div>
            <div>
                {/* Any additional components or elements can be added here */}
            </div>
            <Grid xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Code</TableCell>
                                <TableCell align="right">Condition</TableCell>
                                <TableCell align="right">Environment</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.GSCode}</TableCell>
                                    <TableCell align="right">{row.Condition}</TableCell>
                                    <TableCell align="right">{row.Status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default ViewGrowShed;
