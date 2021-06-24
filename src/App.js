import React, { Fragment, useEffect, useState } from "react";
import Dashboard from "./layout/Dashboard";
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import { userActions } from "./store/user";

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);

  useEffect(() => {
    axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/moviesUsers.json`)
      .then(res => {
        let transformedData = [];
        for (let key in res.data) {
          transformedData.push(res.data[key]);
        }

        for (let user of transformedData) {
          if (localStorage.getItem('_currentUser') === user.username) {
            dispatch(userActions.setUser(user));
            dispatch(authActions.login());
          }
        }
        setIsLoading(false);
      })

  })

  return (
    <Fragment>
      {isLoading ? <CircularProgress style={{ margin: "20% 30% 0 45%" }} size={50} /> :
        <Dashboard
          currentUser={currentUser}
        />}
    </Fragment>
  );
}
