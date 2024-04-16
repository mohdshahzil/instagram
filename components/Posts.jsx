import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import { db } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function Posts({ postId, user, userName, caption, imageURL }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [commentID, setCommentID] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              comment: doc.data(),
            }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: newComment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewComment("");
  };

  const handleEdit = (id, txt) => {
    setShow(true);
    setEditComment(txt);
    setCommentID(id);
  };

  const updateComment = () => {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentID)
      .update({
        text: editComment,
      });
    setShow(false);
  };

  return (
    <div
      className="w-11/12 md:w-2/3 "
      style={{
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "5px",

        display: "flex",
      }}
    >
      <Grid container spacing={3} sx={{ margin: "12px" }}>
        <Grid item xs={12}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar alt={userName} src=" " />
            <Typography variant="subtitle1" style={{ marginLeft: "10px" }}>
              {userName}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <img src={imageURL} alt="Post" style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <b>{userName} : </b> {caption}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {comments.map(({ id, comment }) => (
            <Stack direction="row" alignItems="center" spacing={1} key={id}>
              <Typography variant="body2">
                <b>{comment.username}</b>: &nbsp;{comment.text}
              </Typography>
              {user &&
                (comment.username === user.displayName ||
                  user.displayName === userName) && (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(id, comment.text)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        db
                          .collection("posts")
                          .doc(postId)
                          .collection("comments")
                          .doc(id)
                          .delete()
                      }
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </>
                )}
            </Stack>
          ))}
        </Grid>
        {user && show && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Edit comment"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={updateComment}>
              Update
            </Button>
          </Grid>
        )}
        {user && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={postComment}>
              Post
            </Button>
            {user.displayName === userName && (
              <IconButton
                color="error"
                onClick={() => db.collection("posts").doc(postId).delete()}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Posts;
