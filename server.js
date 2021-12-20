const express = require('express')
const app = express()
const path = require('path')
const ws = require('ws')


const randomNumber = () => {
   const num =  Math.round(Math.random() * 1000)
    return { num }}  

const numbers = []; 

numbers.push(randomNumber())
numbers.push(randomNumber())

console.log(numbers)


app.get('/', (req,res) => res.sendFile(path.join(__dirname,'index.html')))

app.post('/', (req, res) => {
    //when clicked on from client end, invoke the randomnumber function 
    const message = randomNumber(); 
    //update the array of numbers 
    numbers.push(message) 
    //also send the number received from randomNumber() to the client's end 
    res.send(message)
}) 


const port = process.env.PORT || 8080; 

//app.listen can return a server 
const server = app.listen(port, ()=> console.log(`listening on ${port}`)) 

//server side connection for websocket 
const webSocketServer = new ws.Server({server})

//managing multiple sockets 
let sockets = []
//Event listener 
//Every refresh, websocket gets replaced. 
webSocketServer.on('connection', (socket) => { 
    sockets.push(socket)
      //can't send objects, has to be a string or a buffer or some array 
    socket.send(JSON.stringify({history:numbers}))
    socket.on('message', (data)=>{
        //filter prevents double entry on the sender's so that if it's the sender, it wont read the data that it sent out, it'll just see it on the list 
        sockets.filter(s=> s!== socket).forEach( s => s.send(data))
        
    })
    //refresh or close
    socket.on('close', () => {
        //redefines the sockets array without the current socket that closes
        sockets = sockets.filter(s => s != socket)
    })
}) 