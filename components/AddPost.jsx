// import { Button, TextField, Typography } from "@mui/material";
// import React, { useState } from "react";

// const AddPost = () => {
//   const handleChange = () => {};

//   return (
//     <div className="flex flex-col items-center justify-center m-2 p-4 gap-2 border border-solid">
//       <Typography variant="h4">Add New Post</Typography>
//       <input
//         type="file"
//         onChange={() => {
//           handleChange;
//         }}
//       />
//       <TextField id="filled-basic" label="Description"></TextField>
//       <Button variant="contained">POST</Button>
//     </div>
//   );
// };

// export default AddPost;

import { Button, Snackbar, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { storage, db } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";
const AddPost = ({ username }) => {
  const [caption, setcaption] = useState("");
  const [progress, setprogress] = useState(0);
  const [image, setImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    if (!image) {
      alert("No image selected");
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please select a smaller file.");
      return;
    }
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setprogress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageURL: url,
                userName: username,
              })
              .then(() => {
                setSnackbarOpen(true);
              });
          });
      }
    );
    setcaption(" ");
    setImage(null);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div className="flex flex-col items-center justify-center m-2 p-4 gap-4 border border-solid border-gray-300 rounded-lg">
      <Typography variant="h4" className="text-gray-800 font-semibold">
        Add New Post
      </Typography>
      <label htmlFor="file-input" className="cursor-pointer">
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <Button
          variant="outlined"
          startIcon={<PhotoCameraIcon />}
          component="span" // Added component="span" to allow the button to trigger file selection
          className="text-blue-500"
        >
          Upload Photo
        </Button>
      </label>
      <TextField
        id="filled-basic"
        label="Description"
        fullWidth
        className="bg-gray-100"
        onChange={(e) => setcaption(e.target.value)}
        value={caption}
      />
      <progress value={progress} max="100" />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        className="text-white"
        onClick={handleUpload}
      >
        Post
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Post uploaded"
        action={
          <Button color="primary" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </div>
  );
};

export default AddPost;
