import React, { useEffect, useState } from 'react';
import { ButtonBase, Card, Grid, CardContent, CardHeader, CardActions, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './MovieItem.css';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router';
import axios from 'axios';
import Rating from '@material-ui/lab/Rating';
import { useSelector } from 'react-redux';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    gridContainer: {
        paddingLeft: "40px",
        paddingRight: "40px",
        paddingTop: "20px"
    }
});
function MovieItem(props) {
    const classes = useStyles();
    const history = useHistory();
    const [color, setColor] = useState('primary');
    const [ratingValue, setRatingValue] = useState(0);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const { imdbID, Title, Year, Poster } = props;
    const favouriteMovies = props.favouriteMovies;

    const isUserLoggedIn = useSelector(state => state.user.currentUser);

    useEffect(() => {
        if (!favouriteMovies) {
            return null;
        }
        const movieInFavourite = () => {
            for (let movie of favouriteMovies) {
                if (movie.imdbID === imdbID) {
                    setColor('secondary');
                }
            }
        }
        const showRatingValue = () => {
            let tmp_movieRating = 0;
            axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=30b35f15`)
                .then(res => {
                    tmp_movieRating = Number(res.data.Ratings[0].Value.slice(0, 1));
                    setRatingValue(tmp_movieRating / 2);
                })
        }
        showRatingValue();
        movieInFavourite();

    }, [favouriteMovies, imdbID]);


    // const addToFavourites = () => {
    //     if (!isUserLoggedIn) {
    //         setIsAlertVisible(true);
    //     } else {
    //         if (color === 'primary') {
    //             dispatch(favouriteMoviesActions.addToFavourites({ imdbID, Title, Year, Poster }));
    //             setColor('secondary');
    //         } else {
    //             removeFromFavourites();
    //         }
    //     }
    // };

    // const removeFromFavourites = () => {
    //     dispatch(favouriteMoviesActions.removeFromFavourites({ imdbID }));
    //     setColor('primary');
    // }

    const openMovieDetail = () => {
        if (isUserLoggedIn) {
            history.push(`/${props.imdbID}`);
        } else{
            setIsAlertVisible(true);
        }
    }
    const addToFavourites = () => {
        if (isUserLoggedIn) {
            if (color === 'primary') {
                setColor('secondary')
                props.onAddToFavourites({ imdbID, Title, Year, Poster }, color);
            } else {
                removeFromFavourites();
            }
        }
        else {
            setIsAlertVisible(true);
        }

    };

    const removeFromFavourites = () => {
        props.onRemoveFromFavourites(imdbID, color);
        setColor('primary');
    }

    const itemsStyle = window.innerWidth < 1025 ? 'root-responsive' : 'root';

    const handleCloseNotification = () => {
        setIsAlertVisible(false);
    }
    return (
        <div style={{ marginTop: 50 }}>
            <Snackbar
                open={isAlertVisible}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity="warning"
                    style={{ marginTop: 50 }}
                >
                    Adding movies to favourites is only for registered members!
                    Please Register!
                </Alert>
            </Snackbar>
            <Grid
                container
                spacing={3}
                className={classes.gridContainer}
                justify="center"
            >
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card className={itemsStyle}>
                        <div onClick={openMovieDetail}>
                            <ButtonBase>
                                <img alt="complex" src={props.Poster} className="poster" />
                            </ButtonBase>
                        </div>
                        <CardContent>
                            <CardHeader
                                title={props.Title}
                                subheader={props.Year}
                                style={{ marginTop: -20 }}

                            />
                        </CardContent>
                        <CardActions disableSpacing style={{ marginTop: -30 }}>
                            <IconButton aria-label="add to favorites" onClick={addToFavourites} >
                                <FavoriteIcon color={color} />
                            </IconButton>
                            <Rating name="disabled" value={ratingValue ?? 0} precision={0.5} disabled />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>

    );
};
export default MovieItem;