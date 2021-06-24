import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MovieItem from '../components/MovieItem';
import { CircularProgress } from '@material-ui/core';
import { Result } from 'antd';
let movies = [];

const TopRated = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isResultVisible, setIsResultVisible] = useState(false);
    useEffect(() => {
        let transformedData = [];
        let tmp_movieRating = [];
        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieRatings.json`)
            .then(res => {
                if (res.data === null) {
                    console.log("test",res.data)
                    setIsResultVisible(true);
                    setIsLoading(false);
                }
                for (let key in res.data) {
                    transformedData.push(res.data[key]);
                }
                if (movies.length === 0) {
                    for (let movie of transformedData.slice(0, 10)) {
                        axios.get(`http://www.omdbapi.com/?i=${movie.id}&apikey=30b35f15`)
                            .then(res => {
                                movies.push(res.data);
                            })
                    }
                    return;
                }
                for (let movie of movies) {
                    tmp_movieRating.push(Number(movie.Ratings[0].Value.slice(0, 1)));
                }

                tmp_movieRating.sort((a, b) => {
                    return b - a;
                })
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
    return (<div style={{display: 'flex'}} >
        {isResultVisible && < Result
            status="404"
            subTitle="Sorry, there are no rated movies."
            style={{margin: "10% 30% 0 44%" }}
        />}
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

export default TopRated;