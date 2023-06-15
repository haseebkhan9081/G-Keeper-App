const express =require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
app.use(bodyParser.json());
const socketIO=require("socket.io");
const http=require("http");
const cors = require('cors');
const axios=require("axios");
require('dotenv').config();
app.use(cors());
//mongodb.password: SeM34LgpQEHYmCrf
//mongodb.username: haseeb
//1RB6WF00jN1oUnfV
//connecting to mongodb atlas
 const connectionUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`;
mongoose.connect(connectionUrl,
    {useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:process.env.DB_NAME,   
})
    .then(()=>{
        console.log("connected to database");
    })
    .catch(function(err){
        console.log(err);
        console.log("error connecting to database");
    }
    );
const noteSchema = new mongoose.Schema({
    
    time:Number,
    id:Number,   
    location:String,           
    title:String,
    content:String
});
const Note=mongoose.model("Note",noteSchema);
//imlemening changeStream
const changeStream=Note.watch();
changeStream.on('change',(change)=>{
    console.log(change);
    Note.find({}).then((result)=>{
     //   console.log("the fetched notes from database",result);
        io.sockets.emit("updateNotes",result, (error) => {
            if (error) {
              // Handle the error
              console.error("Error occurred while emitting updateNotes event:", error);
            } else {
              // Event emitted successfully
              console.log("updateNotes event emitted successfully");
            }});
        console.log("notes updated sent");
    }).catch((err)=>{
        console.log("failed to fetch notes",err);
    });

});








const server=http.createServer(app);
const io =socketIO(server,{timeout:60000});
server.listen(5000,'localhost',()=>{
    console.log("server is listening on port 5000");});
    //when the front-end connects to the server
    let socket
io.on("connection",(clientSocket)=>{
    socket=clientSocket;
    console.log("user connected");
//sending the initial notes to the front-end
Note.find({}).then((result)=>{
    //console.log("the fetched notes from database",result);
    clientSocket.emit("updateNotes",result,(err)=>{
        if(err){
console.log("error in sending initial notes",err);
        
    }else{
        console.log("initial notes sent");
    }
});
}).catch((err)=>{
    console.log("failed to fetch notes",err);

})
io.on("disconnect",()=>{console.log("user disconnected");});

});
// when the front-end disconnects from the server




//serving the public folder for static files
app.use(express.static(path.join(__dirname, '..', 'public')));





//handling the post request from front-end
app.post('/notes',function(req,res){
    //console.log("heres the posts request",req.body);
    console.log("the operation is",req.body.operation);
    console.log("the data is",req.body.data);
    if(req.body.operation==="insert"){
        const newNote= new Note({
            location:req.body.data.location,
            time:new Date(),
            id:req.body.data.id,
            title:req.body.data.title,
            content:req.body.data.content
         });
         newNote.save().then((result)=>{
            //console.log("Note Save to Database",result);
           }).catch((err)=>{console.log("failed to save note",err);});
           res.send("inserted  successfully");}
    else if(req.body.operation==="delete"){
        Note.deleteOne({id:req.body.data.id}).then((result)=>{
            console.log("Note Deleted from Database",result);}).catch((err)=>{
                console.log("failed to delete note",err);});
                res.send("deleted  successfully");

    }
    
    
});
//post request for location
app.post("/location",function(req,res){
    console.log("the longitude",req.body.longitude);
    console.log("the latitude",req.body.latitude);
    const apiKey=process.env.API_KEY
    const lat=req.body.latitude;
    const lon=req.body.longitude;
  const Ourl= `https://api.opencagedata.com/geocode/v1/json?q=${lat},+${lon}&key=${apiKey}&language=en&pretty=1`;
     const source=axios.CancelToken.source();
  setTimeout(()=>{
    source.cancel();
  } ,60000
  );
  let name;
   axios.get(Ourl,{cancelToken:source.token}).then((response)=>{
    name=response.data.results[0].formatted;
    console.log(response.data.results[0].formatted);
    res.send(response.data.results[0].formatted);})
    .catch((err)=>{console.log(err);});
   
});
//serving the index.html file
app.get('/',function(req,res){
     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})
//serevr listending
 

