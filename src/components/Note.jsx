import React from "react";
import { IconButton } from "@mui/material";
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import { useState,useEffect } from "react";
function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }
   
  const [postTime, setPostTime] = useState(null);
const [timeAgo, setTimeAgo] = useState('');
useEffect(() => {
  const now =props.time;
  

  const interval = setInterval(() => {
    const currentTime = new Date();
    const elapsed = Math.round((currentTime - now) / 1000); // Use 'now' instead of 'postTime'

    // Calculate the time ago message based on the elapsed time
    let message = '';
    if (elapsed < 60) {
      message = `${elapsed} seconds ago`;
    } else if (elapsed < 3600) {
      const minutes = Math.floor(elapsed / 60);
      message = `${minutes} minutes ago`;
    } else if (elapsed < 86400) {
      const hours = Math.floor(elapsed / 3600);
      message = `${hours} hours ago`;
    } else {
      const days = Math.floor(elapsed / 86400);
      message = `${days} days ago`;
    }

    setTimeAgo(message);
  }, 2000);

  return () => {
    clearInterval(interval);
  };
}, []); // Empty dependency array
  return (
    <div className="note">
      <p className="time">{props.location}</p>
  <h1>{props.title}</h1>
  <p>{props.content}</p>
  <div className="note-content">
    <p className="time" >{timeAgo}</p>
    <IconButton onClick={handleClick}><ClearSharpIcon/></IconButton>
  </div>
</div>

  );
}

export default Note;
