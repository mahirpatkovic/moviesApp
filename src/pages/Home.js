import React from 'react';
import MovieItem from '../components/MovieItem';

import './style/Home.css';
function Home(props) {
    const movies = props.movies;
    if (!movies) {
        return null;
    }
    const addToFavourites = (movie, color) => {
        props.onAddToFavourites(movie, color)
    }

    const removeFromFavourites = (movieId, color) => {
        props.onRemoveFromFavourites(movieId, color);
    }

    return (
        <div className="movie-container">
            {movies.map(movie => {
                return <MovieItem
                    key={movie.imdbID}
                    imdbID={movie.imdbID}
                    Title={movie.Title}
                    Year={movie.Year}
                    Poster={movie.Poster}
                    onAddToFavourites={addToFavourites}
                    onRemoveFromFavourites={removeFromFavourites}
                    favouriteMovies={props.favouriteMovies}
                />
            })}
        </div>
    );
};
export default Home;