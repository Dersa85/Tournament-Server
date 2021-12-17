import { join as pathCreator } from "path";
import { openServer } from './modules/socketServerHandler';

const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      io = require('socket.io')(http)


const DEFAULT_PORT = 7878;
const CLIENT_PATH = pathCreator(__dirname, 'client', 'index.html');

openServer(io)

http.listen(DEFAULT_PORT, () => {
    console.log(`Webserver started on Port ${DEFAULT_PORT}`);
})

app.use(express.static('client'))

// app.get('/', (req: any, res: any) => {
//     res.sendFile(CLIENT_PATH)
// })

