import React, { useState } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user';
import { authActions } from '../store/auth';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));
function Login(props) {
    const [values, setValues] = useState({
        username: '',
        password: '',
    })
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const dispatch = useDispatch();

    const classes = useStyles();
    const handleChange = (val) => (event) => {
        setValues({ ...values, [val]: event.target.value });
    };

    const handleLogin = () => {
        const login = localStorage.getItem('_currentUser');
        axios.get('https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/moviesUsers.json')
            .then(res => {
                let transformedData = [];
                for (let key in res.data) {
                    transformedData.push(res.data[key]);
                }
                for (let user of transformedData) {
                    if (user.username === values.username && user.password === values.password) {
                        window.location.reload();
                        console.log("user Logged in");
                        dispatch(userActions.setUser(user));
                        dispatch(authActions.login());
                        if (login === null) {
                            localStorage.setItem('_currentUser', user.username);
                        }
                        break;
                    }
                    else {
                        setIsAlertVisible(true);
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    return (<div style={{ display: 'flex' }}>
        <Card style={{ margin: "10% 30% 0 44%", padding: "10px" }}>
            {isAlertVisible && <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Wrong username or password — <strong> Try again!</strong>
            </Alert>}
            <h2 style={{ textAlign: 'center' }}>Movie WebApp</h2>
            <div className={classes.margin}>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item>
                        <AccountCircle />
                    </Grid>
                    <Grid item>
                        <TextField id="username" label="Username" onChange={handleChange('username')} />
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item>
                        <LockIcon />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="password"
                            label="Password"
                            type='password'
                            onChange={handleChange('password')}
                        />
                    </Grid>
                </Grid>
            </div>
            <Button variant="contained" color="primary" style={{ margin: "10px 10px 10px 50px" }} onClick={handleLogin}>
                Login
            </Button>
            <h4 style={{ marginLeft: 10 }}>If not registed, please <NavLink to="/signup">SignUp</NavLink></h4>

        </Card>
    </div>);
}

export default Login;