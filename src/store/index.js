import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth';
import userReducer from './user';
import favouriteMoviesReducer from './favourite';

const store = configureStore({
    reducer: { auth: authReducer, user: userReducer, favouriteMovies: favouriteMoviesReducer }
})

export default store;