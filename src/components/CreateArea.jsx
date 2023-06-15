import React, { useState } from "react";
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { Fab } from "@mui/material";
import axios from "axios";
import { Zoom } from '@mui/material';
function CreateArea(props) {
  const [note, setNote] = useState({
    location:"",
    id:0,
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    
    setNote({
      location:"",
      id:0,
      title: "",
      content: ""
    });
    event.preventDefault();
  }
let [isExpanded,setExpanded] = useState(false);

  return (
    <div>
      <form className="create-note">
        {isExpanded && <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />}
        
        
       <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded?3:1}
          onClick={()=>setExpanded(true)}
        /> 
         <Zoom in={isExpanded?true:false}  > 
         <Fab onClick={submitNote}>
          <AddSharpIcon/></Fab>
          </Zoom>
       
      </form>
    </div>
  );
}

export default CreateArea;
