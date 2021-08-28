import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addClients, addClient } from '../redux/clientReducer';
import axios from 'axios';
import { FormGroup, FormControl, InputLabel, Input, FormHelperText, Grid, Card, CardContent, Typography, Button, CardActions, Container } from '@material-ui/core';
import swal from 'sweetalert';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const List = () => {
    const classes = useStyles();

    const dispatch = useDispatch()
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [clients, setClients] = useState([]);
    const userState = useSelector((state) => state.user)
    const clientState = useSelector((state) => state.client.client)

    const [form, setForm] = useState({
        firstName: '', lastName: '', address: '', ssn: ''
    })

    const [errorForm, setErrorForm] = useState({
        firstName: '', lastName: '', address: '', ssn: ''
    })

    const handleChange = (event) => {
        event.preventDefault()
        setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleValidation = () => {
        let fields = form;

        let formIsValid = true;

        //Name
        if (fields.firstName === '') {
            formIsValid = false;
            setErrorForm(prev => ({ ...prev, firstName: "Cannot be empty" }));
        } else {
            setErrorForm({ firstName: "" });
        }

        if (fields.lastName === '') {
            formIsValid = false;
            setErrorForm(prev => ({ ...prev, lastName: "Cannot be empty" }));
        } else {
            setErrorForm({ lastName: "" });
        }

        if (fields.address === '') {
            formIsValid = false;
            setErrorForm(prev => ({ ...prev, address: "Cannot be empty" }));

        } else {
            setErrorForm({ address: "" });
        }

        if (fields.ssn === '') {
            formIsValid = false;
            setErrorForm(prev => ({ ...prev, ssn: "Cannot be empty" }));
        } else {
            setErrorForm({ ssn: "" });

        }

        if (fields.ssn !== "") {
            if (!fields.ssn.match(/[0-9]{3}[-][0-9]{2}[-][0-9]{4}/gm)) {
                formIsValid = false;
                setErrorForm(prev => ({ ...prev, ssn: "Invalid format (000-00-0000)" }));
            } else {
                setErrorForm({ ssn: "" });

            }
        }

        clientState.map(client => {
            if (client.ssn == fields.ssn.trim()) {
                formIsValid = false
                setErrorForm(prev => ({ ...prev, ssn: "Duplicated SSN" }));
            }
        })

        return formIsValid
    }
    const sendForm = (event) => {

        if (handleValidation()) {
            sendRequest()


        } else {
            swal("Error", "Please check form", "error");
        }

    }

    const sendRequest = () => {
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${userState.user.token}`
        }

        axios.post("http://localhost:8081/api/members", form)
            .then(
                (data) => {
                    resetForm()
                    swal("Add Client", `${data.data.firstName} ` + `${data.data.lastName}`, "success");
                    dispatch(addClient(form))
                },
                (error) => {
                    swal("Error", error.message, "error");
                }
            )
    }

    const resetForm = () => {
        setForm({ firstName: '', lastName: '', address: '', ssn: '' })
        setErrorForm({ firstName: '', lastName: '', address: '', ssn: '' })
    }

    useEffect(() => {
        if (userState.user.token) {

            axios.defaults.headers.common = {
                'Authorization': `Bearer ${userState.user.token}`
            }

            axios.get("http://localhost:8081/api/members")
                .then(
                    (data) => {
                        setIsLoaded(true)
                        setClients(data.data);
                        dispatch(addClients(data.data))
                    },
                    (error) => {
                        setIsLoaded(false)
                        setError(error);
                    }
                )
        }

    }, [userState])

    useEffect(() => {
        if (clientState) {
            setClients(clientState)
        }
    }, [clientState])


    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {

        return (
            <Container>
                <Grid contanier>
                    <Grid item md={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Formulario para agregar clientes
                                </Typography>
                                <FormGroup>
                                    <FormControl required error={errorForm.firstName ? true : false}>
                                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                                        <Input name="firstName" onChange={handleChange} value={form.firstName} aria-describedby="First Name" />
                                        {errorForm.firstName !== '' ? (
                                            <FormHelperText error>{errorForm.firstName}</FormHelperText>
                                        ) : ''}
                                    </FormControl>

                                    <FormControl required error={errorForm.lastName ? true : false}>
                                        <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                        <Input name="lastName" onChange={handleChange} value={form.lastName} aria-describedby="Last Name" />
                                        {errorForm.lastName ? (
                                            <FormHelperText error>{errorForm.lastName}</FormHelperText>
                                        ) : ''}
                                    </FormControl>

                                    <FormControl required error={errorForm.address ? true : false}>
                                        <InputLabel htmlFor="address">Address</InputLabel>
                                        <Input name="address" onChange={handleChange} value={form.address} aria-describedby="Address" />
                                        {errorForm.address ? (
                                            <FormHelperText error>{errorForm.address}</FormHelperText>
                                        ) : ''}
                                    </FormControl>

                                    <FormControl required error={errorForm.ssn ? true : false}>
                                        <InputLabel htmlFor="ssn">SSN</InputLabel>
                                        <Input type='text' name="ssn" onChange={handleChange} value={form.ssn} aria-describedby="SSN" />
                                        {errorForm.ssn ? (
                                            <FormHelperText error>{errorForm.ssn}</FormHelperText>
                                        ) : ''}
                                    </FormControl>

                                </FormGroup>


                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" onClick={sendForm}>Save</Button>
                                <Button variant="contained" color="primary" onClick={resetForm}>Reset</Button>

                            </CardActions>
                        </Card>

                    </Grid>
                    <Grid item md={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Listado de clientes
                                </Typography>

                                <TableContainer component={Paper}>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">First Name</TableCell>
                                                <TableCell align="right">Last Name</TableCell>
                                                <TableCell align="right">Address</TableCell>
                                                <TableCell align="right">SSN</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {clients.map((row) => (
                                                <TableRow key={row.ssn}>
                                                    <TableCell align="right">{row.firstName}</TableCell>
                                                    <TableCell align="right">{row.lastName}</TableCell>
                                                    <TableCell align="right">{row.address}</TableCell>
                                                    <TableCell align="right">{row.ssn}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>


        );
    }
}

export default List;