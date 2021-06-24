import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextareaAutosize, DialogActions, Button } from '@material-ui/core';
import axios from 'axios';
import { useSelector } from 'react-redux';
let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let hour = today.getHours();
let min = today.getMinutes();

today = day + '.' + month + '.' + year + '. - ' + hour + ':' + min;
function CommentsDialog(props) {
    const [newComment, setNewComment] = useState({
        id: props.movieId,
        user: useSelector(state => state.user.currentUser).username,
        comment: "",
        date: today,
    })

    const onChangeHandlerComments = (event) => {
        setNewComment({ ...newComment, comment: event.target.value });
    }
    const commentHandler = () => {
        axios.post(`https://react-http-1b2a8-default-rtdb.europe-west1.firebasedatabase.app/movieComments.json`, (newComment))
            .then(() => {
                console.log("Comment created")
            })
            .catch(err => {
                console.error(err);
            })
        props.onClose(newComment, true);
    }
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.onClose}
            >
                <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
                    Add new comment
                </DialogTitle>
                <DialogContent dividers>
                    <TextareaAutosize style={{ marginTop: 10, width: 500, height: 100 }} onChange={onChangeHandlerComments} /><br />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} variant="contained">
                        Close
                    </Button>
                    <Button onClick={commentHandler} color="primary" variant="contained">
                        Comment
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default CommentsDialog;