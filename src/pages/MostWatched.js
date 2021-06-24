import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieItem from '../components/MovieItem';
import { CircularProgress } from '@material-ui/core';

let movies = [];

const MostWatched = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let transformedData = [];
        axios.get('https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieVisit.json')
            .then(res => {
                for (let key in res.data) {
                    transformedData.push(res.data[key]);
                }
                if (movies.length === 0) {
                    for (let movie of transformedData.slice(0,10).sort((a, b) => b.opened - a.opened)) {
                        axios.get(`http://www.omdbapi.com/?i=${movie.id}&apikey=30b35f15`)
                            .then(res => {
                                movies.push(res.data);
                            })
                    }
                    return;
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
            })

    }, []);

    const addToFavourites = (movie, color) => {
        props.onAddToFavourites(movie, color)
    }

    const removeFromFavourites = (movieId, color) => {
        props.onRemoveFromFavourites(movieId, color);
    }
    return (<div >
        {isLoading ? <CircularProgress style={{ margin: "20% 30% 0 45%" }} size={50} /> : <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {movies.map((movie, id) => {
                return <MovieItem
                    key={id}
                    imdbID={movie.imdbID}
                    Title={movie.Title}
                    Year={movie.Year}
                    Poster={movie.Poster}
                    onAddToFavourites={addToFavourites}
                    onRemoveFromFavourites={removeFromFavourites}
                    favouriteMovies={props.favouriteMovies}
                />
            })}
        </div>}
    </div>);
}

export default MostWatched;