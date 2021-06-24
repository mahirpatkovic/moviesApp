import { createSlice } from "@reduxjs/toolkit";


const initialFavouriteMoviesState = {
    favouriteMovies: [],
};

const favouriteMoviesSlice = createSlice({
    name: 'favouriteMovies',
    initialState: initialFavouriteMoviesState,
    reducers: {
        addToFavourites(state, {payload: movie}){
            state.favouriteMovies.push(movie);
            console.log(state, movie)
        },
        removeFromFavourites(state, action) {

            // state.favouriteMovies.splice(index)
            // console.log(state.favouriteMovies, action.payload)
            // state.favouriteMovies.filter(action.payload.id != )
        },
        
    }
})

export const favouriteMoviesActions = favouriteMoviesSlice.actions;

export default favouriteMoviesSlice.reducer;