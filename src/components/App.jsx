import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Note from "./Note.jsx";
import CreateArea from "./CreateArea.jsx";
import axios from "axios";
import io from "socket.io-client";
axios.defaults.headers['Content-Type'] = 'application/json';


function App() {
  const [notes, setNotes] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  let once=true;
  let location="Earth";
useEffect(()=>{
  const socket = io("http://localhost:5000", {
    transports: ["websocket"], // Explicitly specify the transport method
  });
  socket.on('connect',()=>{
    console.log("connected to the backend server!");
  });
  
  
  socket.on("updateNotes",(data)=>{
    console.log("the data recieved: ",data);
    let tempNotes=[{location:"Earth",time:new Date(),id:Date.now(),title:"sample title",content:"sample content"}];
    if(data.length>0){
     
    data.map((data)=>{
     tempNotes.push({location:data.location,time:data.time,id:data.id,title:data.title,content:data.content});
    });}
     
    setNotes(tempNotes);
    
  });
  return ()=>{
    socket.disconnect();
  };
},[]);
//getting the locationof the user

  if ('geolocation' in navigator && once) {
    navigator.geolocation.getCurrentPosition((position)=>{
       once=false;
      const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
     axios.post("/location",{latitude,longitude})
     .then(response=>{
       console.log("the respone for Location request:",response);
       location=response.data;
     }).catch((err)=>{
      location="can't get location!";
       console.log("the respone for Location request:",err);
     
     })
     
   },(err)=>{
     console.error('Error getting location:', err.message);
    });
 } else {
   // Geolocation API is not supported
 }


  function addNote(newNote) {
   newNote.id=Date.now();
   newNote.location=location;

    //making the post request or posting the data to the server
    axios.post("/notes",{operation:"insert",data:newNote})
    .then(response=>{
console.log(response);
    })
    .catch(error=>{
    console.log(error);
    });


    
  }

  function deleteNote(ide) {

    console.log("deleteNote called on id:",ide);
    axios.post("/notes",{operation:"delete",data:{id:ide,title:"",content:""}}).then((response)=>{console.log(response)});
    //making the post request for deleting the data from the server
    //witch specific id
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== ide;
      });
    });
  }
 


  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem.id}
            location={noteItem.location}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            time={noteItem.time}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
