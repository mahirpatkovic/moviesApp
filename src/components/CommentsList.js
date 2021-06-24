import React, { Fragment } from 'react';
import { Divider, List, ListItem, ListItemText, Typography } from '@material-ui/core';
function CommentsList(props) {
    const comments = props.comments;
    if (!comments) {
        return null;
    }
    return (
        <div>
            {comments.map((comment, id) => {
                return <List key={id}>
                <ListItem alignItems="flex-start">
                    <ListItemText
                        primary={`${comment.comment}`}
                        secondary={
                            <Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="textPrimary"
                                >
                                    {comment.user}
                                </Typography>
                                {` — ${comment.date}`}
                            </Fragment>
                        }
                    />
                </ListItem>
                <Divider />
            </List>
            })}
           
        </div>
    )
}

export default CommentsList;