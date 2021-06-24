import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import NavigationBar from "./NavigationBar";
import Favourites from "../pages/Favourites";
import MovieDetail from "../pages/MovieDetail";
import MostWatched from "../pages/MostWatched";
import TopRated from "../pages/TopRated";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { CircularProgress } from '@material-ui/core';

function Dashboard() {
    const [movies, setMovies] = useState([]);
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isUserLoggedIn = useSelector(state => state.auth.isAuthenticated);
    const currentUser = useSelector(state => state.user.currentUser);
    useEffect(() => {
        const getMovies = () => {
            axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/moviesdb.json`)
                .then(mov => {
                    let tmpMovies = [];
                    setMovies(mov.data);
                    if (isUserLoggedIn && tmpMovies.length === 0) {
                        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/favouriteMovies.json`)
                            .then(res => {
                                for (let key in res.data) {
                                    if (res.data[key].user === currentUser.username) {
                                        for (let movie of mov.data) {
                                            if (res.data[key].movieId === movie.imdbID) {
                                                setFavouriteMovies((prevState) => {
                                                    return [...prevState, movie];
                                                });
                                                tmpMovies.push(movie);
                                                setIsLoading(false);
                                            }
                                        }
                                    }
                                }
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                })
        }

        getMovies();
    }, []);

    const addToFavourites = (movie) => {
        axios.post(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/favouriteMovies.json`, { movieId: movie.imdbID, user: currentUser.username })
            .then(() => {
                setFavouriteMovies((prevState) => {
                    return [...prevState, movie]
                })
            })
            .catch(err => {
                console.error(err);
            })

    }

    const removeFromFavourites = (movieId) => {
        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/favouriteMovies.json`)
            .then(res => {
                for (let key in res.data) {
                    if (res.data[key].movieId === movieId && res.data[key].user === currentUser.username) {
                        axios.delete(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/favouriteMovies/${key}.json`)
                            .then(() => {
                                let dataSource = [...favouriteMovies];
                                setFavouriteMovies(dataSource.filter(movie => movieId !== movie.imdbID));
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    const searchMovieHandler = (movie) => {
        if (movie.length > 0) {
            axios.get(`http://www.omdbapi.com/?s=${movie}&apikey=30b35f15`)
                .then(res => {
                    if (res.data.Search) {
                        setMovies(res.data.Search)
                    }
                })
        }
        else {
            axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/moviesdb.json`)
                .then(res => {
                    setMovies(res.data)
                })
        }
    }

    return (
        <div>
            {isLoading ? <CircularProgress style={{ margin: "20% 30% 0 45%" }} size={50} /> : <Router>
                <NavigationBar
                    onSearchMovie={searchMovieHandler}
                />

                <Switch>
                    <Route path="/" exact>
                        <Home
                            movies={movies}
                            onAddToFavourites={addToFavourites}
                            onRemoveFromFavourites={removeFromFavourites}
                            favouriteMovies={favouriteMovies}
                        />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/favourites">
                        {!isUserLoggedIn ? <Redirect to="/" />
                            : <Favourites
                                onAddToFavourites={addToFavourites}
                                onRemoveFromFavourites={removeFromFavourites}
                                favouriteMovies={favouriteMovies}
                            />}
                    </Route>
                    <Route path="/most-watched" exact>
                        {!isUserLoggedIn ? <Redirect to="/" /> : <MostWatched
                            movies={movies}
                            onAddToFavourites={addToFavourites}
                            onRemoveFromFavourites={removeFromFavourites}
                            favouriteMovies={favouriteMovies}
                        />}
                    </Route>
                    <Route path="/top-rated" exact>
                        {!isUserLoggedIn ? <Redirect to="/" /> : <TopRated
                            movies={movies}
                            onAddToFavourites={addToFavourites}
                            onRemoveFromFavourites={removeFromFavourites}
                            favouriteMovies={favouriteMovies}
                        />}
                    </Route>
                    <Route exact path="/login">
                        {isUserLoggedIn ? <Redirect to="/" /> : <Login />}
                    </Route>
                    <Route exact path="/signup">
                        {isUserLoggedIn ? <Redirect to="/" /> : <Signup />}
                    </Route>
                    <Route exact path="/:movieId">
                        {!isUserLoggedIn ? <Redirect to="/" /> : <MovieDetail />}
                    </Route>

                </Switch>
            </Router>}
        </div >

    );
}

export default Dashboard;