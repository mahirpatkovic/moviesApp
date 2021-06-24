// import { useEffect } from "react";
// import { useSelector } from "react-redux";
import MovieItem from "../components/MovieItem";
import Alert from '@material-ui/lab/Alert';
import './style/Favourites.css';

const Favourites = (props) => {
    const favouriteMovies = props.favouriteMovies;
    
    const removeFromFavourites = (movieId) => {
        props.onRemoveFromFavourites(movieId);
    }
    return (<div className="movie-container">
        {favouriteMovies.length > 0 ? 
        favouriteMovies.map(movie => {
            return <MovieItem
                key={movie.imdbID}
                imdbID={movie.imdbID}
                Title={movie.Title}
                Year={movie.Year}
                Poster={movie.Poster}
                onRemoveFromFavourites={removeFromFavourites}
                favouriteMovies={props.favouriteMovies}
            />
        })
        : <Alert severity="warning" style={{margin: '20% 30% 0 35%'}}>You didn't add any movie to favourites !!!</Alert>}
    </div>);
}

export default Favourites;