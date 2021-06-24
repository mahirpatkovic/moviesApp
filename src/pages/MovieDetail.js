import React from 'react';
import {
    Card, Container, Grid, Box, Typography, Paper,
    CardHeader, CircularProgress, Button, Snackbar
} from "@material-ui/core";
import axios from "axios";
import { Rating } from '@material-ui/lab';
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CommentsList from '../components/CommentsList';
import CommentsModal from '../components/CommentsModal';
import MuiAlert from "@material-ui/lab/Alert";
import { useSelector } from 'react-redux';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState([]);
    const [movieRatedValue, setMovieRatedValue] = useState(0);
    const [userRatingValue, setUserRatingValue] = useState(0);
    const [isRatingDisabled, setIsRatingDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const isUserLoggedIn = useSelector(state => state.user.currentUser);

    const currentUser = useSelector(state => state.user.currentUser);
    useEffect(() => {
        let tmp_movieRating = 0;
        let counter = 1;
        axios.get(`http://www.omdbapi.com/?i=${movieId}&apikey=30b35f15`)
            .then(res => {
                setMovie(res.data);
                tmp_movieRating = Number(res.data.Ratings[0].Value.slice(0, 1));
                setMovieRatedValue(tmp_movieRating / 2)
                setIsLoading(false);
            })
        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieRatings.json`)
            .then(res => {
                let transformedData = [];
                for (const key in res.data) {
                    const ratingObj = {
                        id: key,
                        ...res.data[key],
                    };
                    if (ratingObj.id === movieId && ratingObj.user === currentUser.username) {
                        transformedData.push(ratingObj);
                        setIsRatingDisabled(true);
                        setUserRatingValue(Number(ratingObj.value));
                    }
                }
                
                
            })

        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieVisit.json`)
            .then(res => {
                let transformedMovieData = "";
                for (const key in res.data) {
                    if (res.data[key].id === movieId) {
                        transformedMovieData = key;
                        counter = res.data[key].opened + 1;
                        axios.put(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieVisit/${key}.json`,
                            { id: movieId, opened: counter })
                            .then(() => {
                                console.log("movie visit incresed");
                            }).catch(err => {
                                console.error(err);
                            })
                    }
                }
                if (transformedMovieData === "") {
                    axios.post(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieVisit.json`,
                        { id: movieId, opened: counter })
                        .then(() => {
                            console.log("movie open for the first time");
                        }).catch(err => {
                            console.error(err);
                        })
                }

            })

        axios.get(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieComments.json`)
            .then(res => {
                let transformedData = [];
                for (let key in res.data) {
                    if (res.data[key].id === movieId) {
                        transformedData.push(res.data[key]);
                    }
                }
                setComments(transformedData)
            })

    }, [movieId, currentUser.username]);

    const rateMovieHandler = (event) => {
        axios.post(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieRatings.json`, { id: movie.imdbID, user: currentUser.username, value: event.target.value })
            .then(() => {
                console.log("Movie rated");
                setUserRatingValue(Number(event.target.value));
                setIsRatingDisabled(true);
            })
    }

    const openCommentModalHandler = () => {
        if (!isUserLoggedIn) {
            setIsAlertVisible(true);
        } else {
            setIsCommentModalVisible(true);
        }
    }

    const closeCommentModalHandler = (newComment, isOk) => {
        if (isOk) {
            let tmpComments = comments;
            tmpComments.push(newComment)
            setComments([...tmpComments])
        }
        setIsCommentModalVisible(false);
    }

    const handleCloseNotification = () => {
        setIsAlertVisible(false);
    }

    return (
        <Container style={{ display: 'flex' }}>

            {isLoading ? <CircularProgress style={{ margin: "20% 30% 0 45%" }} size={50} /> : <Card style={{ marginTop: 70, marginBottom: 10 }}>
                <Snackbar
                    open={isAlertVisible}
                    autoHideDuration={6000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseNotification}
                        severity="warning"
                        style={{ marginTop: 60 }}
                    >
                        Comment movie section is only for registered members!
                        Please Register!
                    </Alert>
                </Snackbar>
                <CardHeader
                    title={movie.Title}
                    subheader={`Release date: ${movie.Released}`}
                    style={{ backgroundColor: "silver" }}
                />

                <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <img alt={movie.Title} src={movie.Poster} style={{ borderRadius: "0 10px 10px 0" }} />
                    <Grid item xs={12} sm={5} lg={4} xl={4}>
                        <Paper>
                            <Grid item xs={12} sm={4} lg={4} xl={3}>

                                <Box component="fieldset" mb={3} borderColor="transparent">
                                    <Typography component="legend">Overall Rating: <strong>{movieRatedValue}</strong></Typography>
                                    <Rating
                                        name="customized-empty"
                                        value={userRatingValue ?? 0}
                                        precision={0.5}
                                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        onChange={rateMovieHandler}
                                        size="large"
                                        disabled={isRatingDisabled}
                                    />

                                </Box>
                            </Grid >
                            {userRatingValue > 0 && <Typography>
                                Your rating value is: <strong>{userRatingValue}</strong>
                            </Typography>}
                        </Paper>

                        <Typography style={{ marginTop: 10 }}>
                            {movie.Plot}<br />
                            Language: <strong>{movie.Language}</strong><br />
                            Production: <strong>{movie.Production}</strong> <br />
                            Rated: <strong>{movie.Rated}</strong> <br />
                            Runtime: <strong>{movie.Runtime}</strong> <br />
                            Writer: <strong>{movie.Writer}</strong> <br />
                        </Typography>
                    </Grid>

                </Grid>

                <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={openCommentModalHandler}>Comment</Button>
                {comments.length > 0 && <CommentsList comments={comments} />}
                <CommentsModal
                    open={isCommentModalVisible}
                    onClose={closeCommentModalHandler}
                    movieId={movieId}
                />
            </Card>}



        </Container>

    );
}

export default MovieDetail;