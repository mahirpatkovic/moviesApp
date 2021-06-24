import React, { useState } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import { NavLink } from 'react-router-dom';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import axios from 'axios';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user';
import { authActions } from '../store/auth';
function Signup(props) {
    const [values, setValues] = useState({
        email: '',
        fullName: '',
        username: '',
        password: '',
    })
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const dispatch = useDispatch();
    const handleChange = (val) => (event) => {
        setValues({ ...values, [val]: event.target.value });
    };

    const handleSignup = () => {
        let transformedData = [];
        let tmpUser = [];
        const login = localStorage.getItem('_currentUser');
        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/moviesUsers.json`)
            .then(res => {
                for (let key in res.data) {
                    transformedData.push(res.data[key]);
                }
                for (let user of transformedData) {
                    if (user.email === values.email || user.username === values.username) {
                        setIsAlertVisible(true);
                        tmpUser.push(user);
                    }
                }
                if (tmpUser.length === 0) {
                    axios.post(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/moviesUsers.json`, values)
                        .then(() => {
                            console.log("user created");
                            dispatch(userActions.setUser(values));
                            dispatch(authActions.login());
                            if (login === null) {
                                localStorage.setItem('_currentUser', values.username);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }
            })
    }

    return (<div style={{ display: 'flex' }} >
        <Card style={{ margin: "10% 30% 0 44%", padding: "20px" }}>
            {isAlertVisible && <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Username or Email already exist — <strong> Try something else!</strong>
            </Alert>}
            <h2 style={{ textAlign: 'center' }}>Movie WebApp</h2>
            <div >
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item>
                        <PersonOutlineIcon />
                    </Grid>
                    <Grid item>
                        <TextField id="fullName" label="Full Name" onChange={handleChange('fullName')} />
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item>
                        <MailOutlineIcon />
                    </Grid>
                    <Grid item>
                        <TextField id="email" label="Email" onChange={handleChange('email')} />
                    </Grid>
                </Grid>
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
            <Button variant="contained" color="primary" style={{ margin: "10px 10px 10px 50px" }} onClick={handleSignup}>
                Signup
            </Button>
            <h4 style={{ marginLeft: 10 }}>If registered, please <NavLink to="/login">LogIn</NavLink></h4>
        </Card>
    </div>);
}
export default Signup;